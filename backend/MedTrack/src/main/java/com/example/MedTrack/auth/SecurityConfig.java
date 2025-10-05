package com.example.MedTrack.auth;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.context.annotation.Bean;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

   @Bean
   public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
   }

   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration configuration = new CorsConfiguration();
       configuration.setAllowedOriginPatterns(Arrays.asList(
           "http://localhost:*", 
           "https://localhost:*",
           "https://*.netlify.app",
           "https://*.vercel.app",
           "https://medtrack.netlify.app"
       ));
       configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
       configuration.setAllowedHeaders(Arrays.asList("*"));
       configuration.setAllowCredentials(true);
       
       UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
       source.registerCorsConfiguration("/**", configuration);
       return source;
   }

   @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       http.csrf(csrf -> csrf.disable())
           .cors(cors -> cors.configurationSource(corsConfigurationSource()))
           .authorizeHttpRequests(auth -> auth
                  .requestMatchers("/api/auth/**").permitAll()
                  .requestMatchers("/swagger-ui/**").permitAll()
                  .requestMatchers("/swagger-ui.html").permitAll()
                  .requestMatchers("/v3/api-docs/**").permitAll()
                  // User location access - Users can view their own locations
                  .requestMatchers("GET", "/api/users/*/locations").hasAnyRole("ADMIN", "MANAGER", "REP")
                  .requestMatchers("GET", "/api/users/by-location/*").hasAnyRole("ADMIN", "MANAGER")
                  // User location management - ADMIN only
                  .requestMatchers("PUT", "/api/users/*/locations").hasRole("ADMIN")
                  .requestMatchers("POST", "/api/users/*/locations/*").hasRole("ADMIN")
                  .requestMatchers("DELETE", "/api/users/*/locations/*").hasRole("ADMIN")
                  // User management - ADMIN only
                  .requestMatchers("/api/users").hasRole("ADMIN")
                  .requestMatchers("/api/users/**").hasRole("ADMIN")
                   // Location management - All roles can view, ADMIN can modify
                   .requestMatchers("GET", "/api/locations/**").hasAnyRole("ADMIN", "MANAGER", "REP")
                   .requestMatchers("POST", "/api/locations/**").hasRole("ADMIN")
                   .requestMatchers("PUT", "/api/locations/**").hasRole("ADMIN")
                   .requestMatchers("DELETE", "/api/locations/**").hasRole("ADMIN")
                   // Doctor management - All roles can view, ADMIN can modify
                   .requestMatchers("GET", "/api/doctors/**").hasAnyRole("ADMIN", "MANAGER", "REP")
                   .requestMatchers("POST", "/api/doctors/**").hasRole("ADMIN")
                   .requestMatchers("PUT", "/api/doctors/**").hasRole("ADMIN")
                   .requestMatchers("DELETE", "/api/doctors/**").hasRole("ADMIN")
                   // Product management - All roles can view, ADMIN can modify
                   .requestMatchers("GET", "/api/products/**").hasAnyRole("ADMIN", "MANAGER", "REP")
                   .requestMatchers("POST", "/api/products/**").hasRole("ADMIN")
                   .requestMatchers("PUT", "/api/products/**").hasRole("ADMIN")
                   .requestMatchers("DELETE", "/api/products/**").hasRole("ADMIN")
                   // Visit management - REP can create/view own, MANAGER/ADMIN can view all
                   .requestMatchers("GET", "/api/visits/**").hasAnyRole("ADMIN", "MANAGER", "REP")
                   .requestMatchers("POST", "/api/visits/**").hasAnyRole("ADMIN", "REP")
                   .requestMatchers("PUT", "/api/visits/**").hasAnyRole("ADMIN", "REP")
                   .requestMatchers("DELETE", "/api/visits/**").hasRole("ADMIN")
                   // Sample management - REP can create/view own, MANAGER/ADMIN can view all
                   .requestMatchers("GET", "/api/samples/**").hasAnyRole("ADMIN", "MANAGER", "REP")
                   .requestMatchers("POST", "/api/samples/**").hasAnyRole("ADMIN", "REP")
                   .requestMatchers("PUT", "/api/samples/**").hasAnyRole("ADMIN", "REP")
                   .requestMatchers("DELETE", "/api/samples/**").hasRole("ADMIN")
                   // Dashboard - Role-specific access
                   .requestMatchers("/api/dashboard/admin/**").hasRole("ADMIN")
                   .anyRequest().authenticated()
           )
           .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
           .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

       return http.build();
   }
}
