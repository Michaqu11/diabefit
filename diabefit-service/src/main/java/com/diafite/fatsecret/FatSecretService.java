package com.diafite.fatsecret;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;


@Service
@Slf4j
@RequiredArgsConstructor
public class FatSecretService {

    public String getToken() {
        String clientID = "";
        String clientSecret = "";
        String auth = clientID + ":" + clientSecret;
        String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));

        HttpClient httpClient = HttpClient.newBuilder().build();
        String url = "https://oauth.fatsecret.com/connect/token";
        String requestBody = "grant_type=client_credentials&scope=basic";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Authorization", "Basic " + encodedAuth)
                .header("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int statusCode = response.statusCode();
            String responseBody = response.body();
            return responseBody;
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return "";
        }
    }
    private String calculateSignature(String baseString, String sharedSecret) {
        // Implement your HMAC-SHA1 signature calculation here
        // You can use libraries like Apache Commons Codec to calculate HMAC-SHA1
        // and encode it in Base64
        // Example:
        // byte[] hmac = calculateHmacSha1(baseString, sharedSecret);
        // return Base64.encodeBase64String(hmac);
        return ""; // Replace this with your actual code
    }
    private final String OAUTH_CONSUMER_KEY = "";
    private String SHARED_SECRET = "";
    private final String REQUEST_URL = "http://platform.fatsecret.com/rest/server.api";
    private final String REQUEST_METHOD = "GET";
    private final String OAUTH_SIGNATURE_METHOD = "HMAC-SHA1";
    private final String OAUTH_VERSION = "1.0";
    private final String FORMAT = "json";
    public Object searchForProducts(String SEARCH_EXPRESSION, String RECIPE_TYPE, int PAGE_NUMBER, int MAX_RESULTS){
        String METHOD = "recipes.search";
        long OAUTH_TIMESTAMP = new Date().getTime();
        String OAUTH_NONCE = String.valueOf(OAUTH_TIMESTAMP);

        // Create a Signature Base String
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(REQUEST_URL);
        builder.queryParam("format", FORMAT);
        if (MAX_RESULTS != 0)
            builder.queryParam("max_results", MAX_RESULTS);
        builder.queryParam("method", METHOD);
        builder.queryParam("oauth_consumer_key", OAUTH_CONSUMER_KEY);
        builder.queryParam("oauth_nonce", OAUTH_NONCE);
        builder.queryParam("oauth_signature_method", OAUTH_SIGNATURE_METHOD);
        builder.queryParam("oauth_timestamp", OAUTH_TIMESTAMP);
        builder.queryParam("oauth_version", OAUTH_VERSION);
        if (PAGE_NUMBER != 0)
            builder.queryParam("page_number", PAGE_NUMBER);
        if (RECIPE_TYPE != null)
            builder.queryParam("recipe_type", RECIPE_TYPE);
        if (SEARCH_EXPRESSION != null)
            builder.queryParam("search_expression", SEARCH_EXPRESSION);

        String normalizedParameters = builder.build().getQuery();
        String BASE_STRING = REQUEST_METHOD + "&" + REQUEST_URL + "&" + normalizedParameters;

        // Calculate the Signature value
        SHARED_SECRET += "&"; // no user, & needed
        String OAUTH_SIGNATURE = calculateSignature(BASE_STRING, SHARED_SECRET);

        // Build the final request URL
        builder.queryParam("oauth_signature", OAUTH_SIGNATURE);
        String OAUTH_REQUEST_URL = builder.build().toString();

        // Send the Request
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.ACCEPT, "application/json");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(OAUTH_REQUEST_URL, HttpMethod.GET, entity, String.class);
    }

}
