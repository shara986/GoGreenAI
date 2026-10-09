package com.gogreen.api.config;

import com.gogreen.api.entity.Category;
import com.gogreen.api.entity.Nursery;
import com.gogreen.api.entity.Plant;
import com.gogreen.api.entity.PlantType;
import com.gogreen.api.repository.CategoryRepository;
import com.gogreen.api.repository.NurseryRepository;
import com.gogreen.api.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final PlantRepository plantRepository;
    private final NurseryRepository nurseryRepository;

    private static final String DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80";

    private static final Map<String, String> CATEGORY_IMAGES = Map.of(
            "Indoor Plants", "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
            "Air Purifiers", "https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=800&q=80",
            "Succulents & Cacti", "https://images.unsplash.com/photo-1509423350716-97f936074e09?auto=format&fit=crop&w=800&q=80",
            "Outdoor & Flowering", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            "Medicinal & Herbs", "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80"
    );

    private static final Map<String, String> PLANT_IMAGES = Map.of(
            "Monstera Deliciosa", "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80",
            "Snake Plant Laurentii", "https://images.unsplash.com/photo-1593482892290-f54927ae1bac?auto=format&fit=crop&w=800&q=80",
            "Peace Lily", "https://images.unsplash.com/photo-1593691509543-c55fb32e7355?auto=format&fit=crop&w=800&q=80",
            "Aloe Vera Succulent", "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=800&q=80",
            "Red Rose Bush", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
            "Golden Pothos", "https://images.unsplash.com/photo-1597055181300-e3633a207519?auto=format&fit=crop&w=800&q=80",
            "Jade Plant Tree", "https://images.unsplash.com/photo-1509423350716-97f936074e09?auto=format&fit=crop&w=800&q=80",
            "English Lavender", "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80"
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

        // 2. Seed or Update Plants
        if (plantRepository.count() == 0) {
            Optional<Nursery> nurseryOpt = nurseryRepository.findAll().stream().findFirst();
            if (nurseryOpt.isEmpty()) {
                log.warn("No nursery found. Skipping plant seeding.");
                return;
            }
            Nursery nursery = nurseryOpt.get();

            Map<String, Category> categoryMap = categoryRepository.findAll().stream()
                    .collect(Collectors.toMap(Category::getName, c -> c));

            log.info("Seeding default plant catalog...");

            List<Plant> plants = List.of(
                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Indoor Plants", categoryRepository.findAll().get(0)))
                            .name("Monstera Deliciosa")
                            .scientificName("Monstera deliciosa")
                            .sku("SKU-MONSTERA-01")
                            .description("Iconic Swiss Cheese plant featuring large glossy leaves with natural split patterns. A statement indoor plant for modern homes.")
                            .careInstructions("Place in indirect bright sunlight. Water once weekly when top 2 inches of soil are dry.")
                            .price(new BigDecimal("29.99"))
                            .stock(20)
                            .plantType(PlantType.INDOOR)
                            .imageUrl(PLANT_IMAGES.get("Monstera Deliciosa"))
                            .active(true)
                            .build(),

                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Air Purifiers", categoryRepository.findAll().get(0)))
                            .name("Snake Plant Laurentii")
                            .scientificName("Sansevieria trifasciata")
                            .sku("SKU-SNAKE-02")
                            .description("Extremely hardy air purifier with upright yellow-edged sword-shaped leaves. Removes formaldehyde and benzene from air.")
                            .careInstructions("Thrives in any light condition. Water sparingly every 2 to 3 weeks.")
                            .price(new BigDecimal("18.50"))
                            .stock(30)
                            .plantType(PlantType.INDOOR)
                            .imageUrl(PLANT_IMAGES.get("Snake Plant Laurentii"))
                            .active(true)
                            .build(),

                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Indoor Plants", categoryRepository.findAll().get(0)))
                            .name("Peace Lily")
                            .scientificName("Spathiphyllum wallisii")
                            .sku("SKU-PEACE-03")
                            .description("Elegant plant featuring glossy dark green foliage and long-lasting white blooms. Excellent air cleaner and humidity lover.")
                            .careInstructions("Keep in medium to indirect light. Water when leaves drop slightly.")
                            .price(new BigDecimal("22.00"))
                            .stock(15)
                            .plantType(PlantType.INDOOR)
                            .imageUrl(PLANT_IMAGES.get("Peace Lily"))
                            .active(true)
                            .build(),

                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Medicinal & Herbs", categoryRepository.findAll().get(0)))
                            .name("Aloe Vera Succulent")
                            .scientificName("Aloe barbadensis Miller")
                            .sku("SKU-ALOE-04")
                            .description("Popular succulent renowned for soothing medicinal gel stored inside thick fleshy leaves. Easy to grow indoors or outdoors.")
                            .careInstructions("Bright sunlight is best. Allow soil to dry completely between waterings.")
                            .price(new BigDecimal("14.99"))
                            .stock(25)
                            .plantType(PlantType.SUCCULENT)
                            .imageUrl(PLANT_IMAGES.get("Aloe Vera Succulent"))
                            .active(true)
                            .build(),

                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Outdoor & Flowering", categoryRepository.findAll().get(0)))
                            .name("Red Rose Bush")
                            .scientificName("Rosa rubiginosa")
                            .sku("SKU-ROSE-05")
                            .description("Classic red blooming rose shrub with fragrant flowers that bloom continuously throughout spring and summer.")
                            .careInstructions("Requires 6+ hours of direct sunlight. Water deep twice weekly.")
                            .price(new BigDecimal("19.75"))
                            .stock(18)
                            .plantType(PlantType.FLOWERING)
                            .imageUrl(PLANT_IMAGES.get("Red Rose Bush"))
                            .active(true)
                            .build(),

                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Air Purifiers", categoryRepository.findAll().get(0)))
                            .name("Golden Pothos")
                            .scientificName("Epipremnum aureum")
                            .sku("SKU-POTHOS-06")
                            .description("Fast-growing trailing vine with heart-shaped variegated green and yellow leaves. Perfect for hanging baskets or tall shelves.")
                            .careInstructions("Tolerates low to medium light. Water when soil feels dry to the touch.")
                            .price(new BigDecimal("15.50"))
                            .stock(40)
                            .plantType(PlantType.INDOOR)
                            .imageUrl(PLANT_IMAGES.get("Golden Pothos"))
                            .active(true)
                            .build(),

                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Succulents & Cacti", categoryRepository.findAll().get(0)))
                            .name("Jade Plant Tree")
                            .scientificName("Crassula ovata")
                            .sku("SKU-JADE-07")
                            .description("Symbol of good luck and prosperity. Features thick woody stems and oval jade-green succulent leaves.")
                            .careInstructions("Full sun to bright indirect light. Avoid overwatering.")
                            .price(new BigDecimal("16.99"))
                            .stock(22)
                            .plantType(PlantType.SUCCULENT)
                            .imageUrl(PLANT_IMAGES.get("Jade Plant Tree"))
                            .active(true)
                            .build(),

                    Plant.builder()
                            .nursery(nursery)
                            .category(categoryMap.getOrDefault("Outdoor & Flowering", categoryRepository.findAll().get(0)))
                            .name("English Lavender")
                            .scientificName("Lavandula angustifolia")
                            .sku("SKU-LAVENDER-08")
                            .description("Fragrant aromatic herb with purple flower spikes. Known for soothing scent, pollinator attraction, and natural stress relief.")
                            .careInstructions("Full sun, warm temperatures and well-drained sandy soil.")
                            .price(new BigDecimal("18.25"))
                            .stock(12)
                            .plantType(PlantType.HERB)
                            .imageUrl(PLANT_IMAGES.get("English Lavender"))
                            .active(true)
                            .build()
            );

            plantRepository.saveAll(plants);
            log.info("Seeded 8 sample plants into database.");
        } else {
            // Update existing plants with verified image URLs
            List<Plant> plants = plantRepository.findAll();
            for (Plant p : plants) {
                if (PLANT_IMAGES.containsKey(p.getName())) {
                    p.setImageUrl(PLANT_IMAGES.get(p.getName()));
                } else if (p.getImageUrl() == null || p.getImageUrl().isBlank()) {
                    p.setImageUrl(DEFAULT_FALLBACK_IMG);
                }
            }
            plantRepository.saveAll(plants);
            log.info("Synchronized image URLs for existing plants.");
        }
    }
}
