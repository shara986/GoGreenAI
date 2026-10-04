package com.gogreen.api.service.impl;

import com.gogreen.api.dto.request.CategoryRequest;
import com.gogreen.api.dto.response.CategoryResponse;
import com.gogreen.api.entity.Category;
import com.gogreen.api.exception.DuplicateResourceException;
import com.gogreen.api.exception.ResourceNotFoundException;
import com.gogreen.api.mapper.CategoryMapper;
import com.gogreen.api.repository.CategoryRepository;
import com.gogreen.api.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException(
                "Category with name '" + request.getName() + "' already exists.");
        }
        Category category = categoryMapper.toEntity(request);
        category = categoryRepository.save(category);
        log.info("Category created: {}", category.getName());
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));

        // Check if name is being changed to an existing name
        if (!category.getName().equalsIgnoreCase(request.getName())
                && categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException(
                "Category with name '" + request.getName() + "' already exists.");
        }

        categoryMapper.updateFromRequest(request, category);
        category = categoryRepository.save(category);
        log.info("Category updated: {}", category.getName());
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
        categoryRepository.delete(category);
        log.info("Category deleted: {}", id);
    }
}
