package com.gogreen.api.mapper;

import com.gogreen.api.dto.request.NurseryRequest;
import com.gogreen.api.dto.response.NurseryResponse;
import com.gogreen.api.entity.Nursery;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface NurseryMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "ownerName", source = "user.name")
    @Mapping(target = "plantCount", ignore = true)
    NurseryResponse toResponse(Nursery nursery);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "plants", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Nursery toEntity(NurseryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "plants", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromRequest(NurseryRequest request, @MappingTarget Nursery nursery);
}
