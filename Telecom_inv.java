import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import javax.persistence.*;
import java.util.*;

// Main Application Entry Point
@SpringBootApplication
public class TelecomInventoryApplication {
    public static void main(String[] args) {
        SpringApplication.run(TelecomInventoryApplication.class, args);
    }
}

// Entity Classes
@Entity
class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String role; // Admin, Manager, Staff

    // Getters and setters
    // ...
}

@Entity
class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String category;
    private int stockLevel;
    private int reorderPoint;

    // Getters and setters
    // ...
}

@Entity
class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String contactInfo;

    // Getters and setters
    // ...
}

@Entity
class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long productId;
    private int quantity;
    private Date timestamp;
    private String type; // "IN" or "OUT"

    // Getters and setters
    // ...
}

// Repositories
interface UserRepository extends JpaRepository<User, Long> {}
interface ProductRepository extends JpaRepository<Product, Long> {}
interface SupplierRepository extends JpaRepository<Supplier, Long> {}
interface TransactionRepository extends JpaRepository<Transaction, Long> {}

// Services
@Service
class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Additional methods for user CRUD operations
    // ...
}

@Service
class ProductService {
    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public void updateStockLevel(Long productId, int quantity, String type) {
        Product product = productRepository.findById(productId).orElseThrow();
        if (type.equals("IN")) {
            product.setStockLevel(product.getStockLevel() + quantity);
        } else if (type.equals("OUT")) {
            product.setStockLevel(product.getStockLevel() - quantity);
        }
        productRepository.save(product);
    }

    // Additional methods for product CRUD operations
    // ...
}

@Service
class SupplierService {
    @Autowired
    private SupplierRepository supplierRepository;

    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // Additional methods for supplier CRUD operations
    // ...
}

// Controllers
@RestController
@RequestMapping("/users")
class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Additional endpoints for user management
    // ...
}

@RestController
@RequestMapping("/products")
class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping("/stock/{type}")
    public ResponseEntity<String> updateStock(@RequestParam Long productId, @RequestParam int quantity, @PathVariable String type) {
        productService.updateStockLevel(productId, quantity, type);
        return ResponseEntity.ok("Stock updated successfully.");
    }

    // Additional endpoints for product management
    // ...
}

@RestController
@RequestMapping("/suppliers")
class SupplierController {
    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    // Additional endpoints for supplier management
    // ...
}

// Security Configuration Placeholder (e.g., JWT Authentication)
