package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.NurseryRequest;
import com.gogreen.api.dto.response.NurseryResponse;
import com.gogreen.api.entity.Nursery;
import com.gogreen.api.entity.User;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.mapper.NurseryMapper;
import com.gogreen.api.repository.PlantRepository;
import com.gogreen.api.repository.NurseryRepository;
import com.gogreen.api.repository.UserRepository;
import com.gogreen.api.service.NurseryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NurseryServiceImpl implements NurseryService {

    private final NurseryRepository nurseryRepository;
    private final UserRepository userRepository;
    private final PlantRepository plantRepository;
    private final NurseryMapper nurseryMapper;

    @Override
    @Transactional(readOnly = true)
    public NurseryResponse getNursery() {
        List<Nursery> nurseries = nurseryRepository.findAll();
        if (nurseries.isEmpty()) {
            throw new ResourceNotFoundException("No nursery has been set up yet.");
        }
        return mapToDetailedResponse(nurseries.get(0));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NurseryResponse> getAllNurseries(String search) {
        List<Nursery> nurseries;
        if (StringUtils.hasText(search)) {
            nurseries = nurseryRepository.searchNurseries(search.trim());
        } else {
            nurseries = nurseryRepository.findAll();
        }
        return nurseries.stream()
                .map(this::mapToDetailedResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NurseryResponse getNurseryById(UUID id) {
        Nursery nursery = nurseryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nursery", "id", id));
        return mapToDetailedResponse(nursery);
    }

    @Override
    @Transactional
    public NurseryResponse getNurseryProfileForUser(String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", ownerUsername));

        Optional<Nursery> nurseryOpt = nurseryRepository.findFirstByUserId(owner.getId());
        if (nurseryOpt.isPresent()) {
            return nurseryMapper.toResponse(nurseryOpt.get());
        }

        // Fallback: If no nursery exists for this owner, create one from user details
        Nursery newNursery = Nursery.builder()
                .user(owner)
                .name(owner.getName() + "'s Nursery")
                .description("Official Nursery of " + owner.getName())
                .address("Default Nursery Address")
                .city("Default City")
                .contactEmail(owner.getEmail())
                .contactPhone(owner.getPhoneNumber())
                .build();

        newNursery = nurseryRepository.save(newNursery);
        log.info("Created missing Nursery profile for owner: {}", ownerUsername);
        return nurseryMapper.toResponse(newNursery);
    }

    @Override
    @Transactional
    public NurseryResponse createNursery(NurseryRequest request, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", ownerUsername));

        Optional<Nursery> existingOpt = nurseryRepository.findFirstByUserId(owner.getId());
        if (existingOpt.isPresent()) {
            return updateNursery(request, ownerUsername);
        }

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

        Nursery nursery = nurseryRepository.findFirstByUserId(owner.getId())
                .orElseGet(() -> Nursery.builder().user(owner).build());

        nurseryMapper.updateFromRequest(request, nursery);
        nursery.setUser(owner);
        nursery = nurseryRepository.save(nursery);

        log.info("Nursery updated: {} by owner: {}", nursery.getName(), ownerUsername);
        return mapToDetailedResponse(nursery);
    }

    private NurseryResponse mapToDetailedResponse(Nursery nursery) {
        NurseryResponse response = nurseryMapper.toResponse(nursery);
        long plantCount = plantRepository.countByNurseryId(nursery.getId());
        response.setPlantCount(plantCount);

        // Assign default coordinates based on city/address if not explicitly specified
        if (response.getLatitude() == null || response.getLongitude() == null) {
            double[] coords = getFallbackCoordinates(nursery.getCity(), nursery.getAddress(), nursery.getName());
            response.setLatitude(coords[0]);
            response.setLongitude(coords[1]);
        }
        return response;
    }

    private double[] getFallbackCoordinates(String city, String address, String name) {
        String combined = ((city != null ? city : "") + " " + (address != null ? address : "") + " " + (name != null ? name : "")).toLowerCase();
        
        if (combined.contains("kolhapur") || combined.contains("tarabai") || combined.contains("shahupuri") || combined.contains("kalamba") || combined.contains("rajarampuri")) {
            if (combined.contains("tarabai")) return new double[]{16.7112, 74.2384};
            if (combined.contains("shahupuri")) return new double[]{16.7025, 74.2410};
            if (combined.contains("kalamba")) return new double[]{16.6780, 74.2250};
            if (combined.contains("rajarampuri")) return new double[]{16.6950, 74.2480};
            return new double[]{16.7050, 74.2433}; // Default Kolhapur center
        } else if (combined.contains("pune")) {
            return new double[]{18.5204, 73.8567};
        } else if (combined.contains("mumbai")) {
            return new double[]{19.0760, 72.8777};
        }
        
        // Dynamic hash-based fallback offset near central regional coordinates
        int hash = Math.abs(combined.hashCode());
        double latOffset = ((hash % 100) - 50) / 1000.0;
        double lngOffset = (((hash / 100) % 100) - 50) / 1000.0;
        return new double[]{16.7050 + latOffset, 74.2433 + lngOffset};
    }
}
