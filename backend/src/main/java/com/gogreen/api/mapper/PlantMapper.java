package com.gogreen.api.mapper;

import com.gogreen.api.dto.request.PlantRequest;
import com.gogreen.api.dto.response.PlantResponse;
import com.gogreen.api.entity.Plant;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PlantMapper {

    @Mapping(target = "nurseryId", source = "nursery.id")
    @Mapping(target = "nurseryName", source = "nursery.name")
    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "category.id", source = "category.id")
    @Mapping(target = "category.name", source = "category.name")
    @Mapping(target = "nursery.id", source = "nursery.id")
    @Mapping(target = "nursery.name", source = "nursery.name")
    PlantResponse toResponse(Plant plant);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "nursery", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Plant toEntity(PlantRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "nursery", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromRequest(PlantRequest request, @MappingTarget Plant plant);
}
