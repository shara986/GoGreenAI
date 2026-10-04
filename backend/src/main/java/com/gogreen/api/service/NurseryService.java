package com.gogreen.api.service;

import com.gogreen.api.dto.request.NurseryRequest;
import com.gogreen.api.dto.response.NurseryResponse;

public interface NurseryService {

    NurseryResponse getNursery();

    NurseryResponse createNursery(NurseryRequest request, String ownerUsername);

    NurseryResponse updateNursery(NurseryRequest request, String ownerUsername);
}
