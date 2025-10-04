package com.example.MedTrack.products;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import com.example.MedTrack.exceptions.BadRequestException;
import com.example.MedTrack.exceptions.ResourceNotFoundException;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    
    public ProductService(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    public ProductDto createProduct(ProductRequest request) {
        // Check if product with same name already exists
        if (productRepository.findByName(request.getName()).isPresent()) {
            throw new BadRequestException("Product with name '" + request.getName() + "' already exists");
        }
        
        Product product = productMapper.toEntity(request);
        Product savedProduct = productRepository.save(product);
        return productMapper.toDto(savedProduct);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return productMapper.toDto(product);
    }

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
            .map(productMapper::toDto)
            .collect(Collectors.toList());
    }

    public List<ProductDto> searchProductsByName(String name) {
        List<Product> products = productRepository.findByNameContaining(name);
        return products.stream()
            .map(productMapper::toDto)
            .collect(Collectors.toList());
    }

    public ProductDto updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        
        Product updatedProduct = productRepository.save(product);
        return productMapper.toDto(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
