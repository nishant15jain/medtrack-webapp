package com.example.MedTrack.products;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "API for managing medical products and samples")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    @Operation(summary = "Create a new product", description = "Creates a new medical product record (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(productService.createProduct(productRequest));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieves a specific product by its ID")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<ProductDto> getProductById(
            @Parameter(description = "ID of the product to retrieve") @PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieves a list of all medical products")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/search")
    @Operation(summary = "Search products by name", description = "Searches for products by name (partial match)")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('REP')")
    public ResponseEntity<List<ProductDto>> searchProductsByName(
            @Parameter(description = "Name to search for") @RequestParam String name) {
        return ResponseEntity.ok(productService.searchProductsByName(name));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Updates an existing product's information (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductDto> updateProduct(
            @Parameter(description = "ID of the product to update") @PathVariable Long id, 
            @RequestBody ProductRequest productRequest) {
        return ResponseEntity.ok(productService.updateProduct(id, productRequest));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete product", description = "Deletes a product by its ID (ADMIN only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(
            @Parameter(description = "ID of the product to delete") @PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
