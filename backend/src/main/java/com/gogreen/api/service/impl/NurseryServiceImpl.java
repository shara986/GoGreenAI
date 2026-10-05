package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.NurseryRequest;
import com.gogreen.api.dto.response.NurseryResponse;
import com.gogreen.api.entity.Nursery;
import com.gogreen.api.entity.User;
import com.gogreen.api.exception.BusinessRuleException;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.mapper.NurseryMapper;
import com.gogreen.api.repository.NurseryRepository;
import com.gogreen.api.repository.UserRepository;
import com.gogreen.api.service.NurseryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NurseryServiceImpl implements NurseryService {

    private final NurseryRepository nurseryRepository;
    private final UserRepository userRepository;
    private final NurseryMapper nurseryMapper;

    @Override
    @Transactional(readOnly = true)
    public NurseryResponse getNursery() {
        List<Nursery> nurseries = nurseryRepository.findAll();
        if (nurseries.isEmpty()) {
            throw new ResourceNotFoundException("No nursery has been set up yet.");
        }
        return nurseryMapper.toResponse(nurseries.get(0));
    }

    @Override
    @Transactional
    public NurseryResponse createNursery(NurseryRequest request, String ownerUsername) {
        // BUSINESS RULE: Only ONE nursery allowed in the entire system
        long count = nurseryRepository.count();
        if (count > 0) {
            throw new BusinessRuleException(
                "A nursery already exists in the system. Only one nursery is allowed.");
        }

        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", ownerUsername));

        Nursery nursery = nurseryMapper.toEntity(request);
        nursery.setUser(owner);
        nursery = nurseryRepository.save(nursery);

        log.info("Nursery created: {} by owner: {}", nursery.getName(), ownerUsername);
        return nurseryMapper.toResponse(nursery);
    }

    @Override
    @Transactional
    public NurseryResponse updateNursery(NurseryRequest request, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", ownerUsername));

        Nursery nursery = nurseryRepository.findFirstByOrderByCreatedAtAsc()
                .orElseThrow(() -> new ResourceNotFoundException(
                    "No nursery has been set up yet."));

        nurseryMapper.updateFromRequest(request, nursery);
        nursery = nurseryRepository.save(nursery);

        log.info("Nursery updated: {} by owner: {}", nursery.getName(), ownerUsername);
        return nurseryMapper.toResponse(nursery);
    }
}
