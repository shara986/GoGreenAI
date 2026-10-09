package com.gogreen.api.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class NurseryResponse {
    private UUID id;
    private UUID userId;
    private String ownerName;
    private String name;
    private String description;
    private String address;
    private String city;
    private String postalCode;
    private String contactEmail;
    private String contactPhone;
    private String logoUrl;
    private Double latitude;
    private Double longitude;
    private long plantCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
