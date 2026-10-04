package com.gogreen.api.mapper;

import com.gogreen.api.dto.response.UserResponse;
import com.gogreen.api.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse toResponse(User user);
}
