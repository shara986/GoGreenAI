package com.gogreen.api.service;

import com.gogreen.api.dto.request.NurseryRequest;
import com.gogreen.api.dto.response.NurseryResponse;

public interface NurseryService {

    NurseryResponse getNursery();

    java.util.List<NurseryResponse> getAllNurseries(String search);

    NurseryResponse getNurseryById(java.util.UUID id);

    NurseryResponse getNurseryProfileForUser(String ownerUsername);

    NurseryResponse createNursery(NurseryRequest request, String ownerUsername);

    NurseryResponse updateNursery(NurseryRequest request, String ownerUsername);
}
