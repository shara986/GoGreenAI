package com.gogreen.api.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class NurseryRequest {

    @NotBlank
    @Size(min = 2, max = 150)
    private String name;

    private String description;

    @NotBlank
    @Size(max = 255)
    private String address;

    @NotBlank
    @Size(max = 100)
    private String city;

    @Size(max = 20)
    private String postalCode;

    @Email
    private String contactEmail;

    @Size(max = 20)
    private String contactPhone;

    private String logoUrl;
}
