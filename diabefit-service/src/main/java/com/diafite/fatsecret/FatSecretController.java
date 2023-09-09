package com.diafite.fatsecret;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/fatsecret")
@RequiredArgsConstructor
public class FatSecretController {

    @Autowired
    private FatSecretService fatSecretService;

    @GetMapping("/token")
    public ResponseEntity<String> getToken() {
        return ResponseEntity.ok(fatSecretService.getToken());
    }

    @GetMapping("/search/{product}")
    public ResponseEntity<Object> searchForProducts(@PathVariable("product") String product) {
        return ResponseEntity.ok(fatSecretService.searchForProducts(product, "asd", 0, 10));
    }
}
