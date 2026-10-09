package com.gogreen.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NurseryRegisterRequest {

    @NotBlank
    @Size(min = 2, max = 100)
    private String name;

    @NotBlank
    @Size(min = 3, max = 50)
    private String username;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 100)
    private String password;

    @NotBlank
    @Size(min = 6, max = 100)
    private String confirmPassword;

    @Size(max = 20)
    private String phoneNumber;

    // Optional nursery details (defaults will be supplied if blank)
    private String nurseryName;
    private String description;
    private String address;
    private String city;
    private String postalCode;

    @Email
    private String contactEmail;

    @Size(max = 20)
    private String contactPhone;

    private String logoUrl;

    private Double latitude;
    private Double longitude;
}
