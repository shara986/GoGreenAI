package com.gogreen.api.config;

import com.gogreen.api.entity.Category;
import com.gogreen.api.entity.Nursery;
import com.gogreen.api.repository.CategoryRepository;
import com.gogreen.api.repository.NurseryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final NurseryRepository nurseryRepository;

    private static final String DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80";

    private static final Map<String, String> CATEGORY_IMAGES = Map.of(
            "Indoor Plants", "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
            "Air Purifiers", "https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=800&q=80",
            "Succulents & Cacti", "https://images.unsplash.com/photo-1509423350716-97f936074e09?auto=format&fit=crop&w=800&q=80",
            "Outdoor & Flowering", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            "Medicinal & Herbs", "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80"
    );

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Running DataInitializer for category and plant image synchronization...");

        // Seed initial local nurseries if database has fewer than 3 nurseries
        List<Nursery> allNurseries = nurseryRepository.findAll();
        if (allNurseries.size() < 3) {
            log.info("Seeding initial local nurseries for Nearby Nurseries feature...");
            com.gogreen.api.entity.User defaultOwner = allNurseries.isEmpty() ? null : allNurseries.get(0).getUser();
            if (defaultOwner != null) {
                List<Nursery> seedNurseries = List.of(
                    Nursery.builder()
                        .user(defaultOwner)
                        .name("Urban Leaf Nursery")
                        .description("Premium indoor and exotic plants, pots, and organic plant care supplies.")
                        .address("882 Tarabai Park, Main Road, Near Circuit House")
                        .city("Kolhapur")
                        .postalCode("416003")
                        .contactEmail("contact@urbanleaf.com")
                        .contactPhone("+91 98765 22222")
                        .logoUrl("https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=400&q=80")
                        .latitude(16.7112)
                        .longitude(74.2384)
                        .build(),
                    Nursery.builder()
                        .user(defaultOwner)
                        .name("NatureNest Plants")
                        .description("Specialized in air-purifying indoor foliage, flowering shrubs, and bonsai trees.")
                        .address("456 Shahupuri 2nd Lane, Near Station Road")
                        .city("Kolhapur")
                        .postalCode("416001")
                        .contactEmail("info@naturenest.in")
                        .contactPhone("+91 98765 33333")
                        .logoUrl("https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=400&q=80")
                        .latitude(16.7025)
                        .longitude(74.2410)
                        .build(),
                    Nursery.builder()
                        .user(defaultOwner)
                        .name("Bloom & Grow Nursery")
                        .description("Wide selection of flowering garden plants, herbs, fruit saplings, and garden tools.")
                        .address("789 Kalamba Lake Road, Opposite ITI")
                        .city("Kolhapur")
                        .postalCode("416007")
                        .contactEmail("support@bloomgrow.com")
                        .contactPhone("+91 98765 44444")
                        .logoUrl("https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80")
                        .latitude(16.6780)
                        .longitude(74.2250)
                        .build(),
                    Nursery.builder()
                        .user(defaultOwner)
                        .name("Green Haven Nursery")
                        .description("Local eco-friendly nursery providing organic fertilizers, soil mixes, and rare succulents.")
                        .address("1245 Rajarampuri 5th Lane, Near Bagal Chowk")
                        .city("Kolhapur")
                        .postalCode("416008")
                        .contactEmail("hello@greenhaven.com")
                        .contactPhone("+91 98765 55555")
                        .logoUrl("https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=400&q=80")
                        .latitude(16.6950)
                        .longitude(74.2480)
                        .build()
                );
                nurseryRepository.saveAll(seedNurseries);
                log.info("Seeded 4 default local nurseries.");
            }
        }

        // 1. Seed or Update Categories
        if (categoryRepository.count() == 0) {
            log.info("Seeding default plant categories...");
            List<Category> categories = List.of(
                    Category.builder()
                            .name("Indoor Plants")
                            .description("Beautiful tropical and foliage plants designed to thrive indoors and brighten your living spaces.")
                            .imageUrl(CATEGORY_IMAGES.get("Indoor Plants"))
                            .build(),
                    Category.builder()
                            .name("Air Purifiers")
                            .description("NASA-tested air purifying plants that filter toxins and improve indoor air quality naturally.")
                            .imageUrl(CATEGORY_IMAGES.get("Air Purifiers"))
                            .build(),
                    Category.builder()
                            .name("Succulents & Cacti")
                            .description("Low-maintenance, water-storing plants perfect for sunny windowsills and office desks.")
                            .imageUrl(CATEGORY_IMAGES.get("Succulents & Cacti"))
                            .build(),
                    Category.builder()
                            .name("Outdoor & Flowering")
                            .description("Vibrant flowering plants and shrubs to create stunning garden displays and balconies.")
                            .imageUrl(CATEGORY_IMAGES.get("Outdoor & Flowering"))
                            .build(),
                    Category.builder()
                            .name("Medicinal & Herbs")
                            .description("Fresh culinary herbs and healing plants for home garden enthusiasts.")
                            .imageUrl(CATEGORY_IMAGES.get("Medicinal & Herbs"))
                            .build()
            );
            categoryRepository.saveAll(categories);
            log.info("Seeded 5 default plant categories.");
        } else {
            // Update existing categories with verified image URLs
            List<Category> categories = categoryRepository.findAll();
            for (Category cat : categories) {
                if (CATEGORY_IMAGES.containsKey(cat.getName())) {
                    cat.setImageUrl(CATEGORY_IMAGES.get(cat.getName()));
                } else if (cat.getImageUrl() == null || cat.getImageUrl().isBlank()) {
                    cat.setImageUrl(DEFAULT_FALLBACK_IMG);
                }
            }
            categoryRepository.saveAll(categories);
            log.info("Synchronized image URLs for existing categories.");
        }

        log.info("DataInitializer complete. Plants are managed exclusively by nursery owners via the dashboard.");
    }
}
