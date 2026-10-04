package com.gogreen.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlantStatisticsResponse {
    private long totalPlants;
    private long activePlants;
    private long inactivePlants;
    private long lowStockPlants;
}
