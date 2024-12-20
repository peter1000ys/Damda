package back.shoppingMart.discount.service;

import back.shoppingMart.discount.dto.DiscountDto;
import back.shoppingMart.discount.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountService {

    private final DiscountRepository discountRepository;

    public List<DiscountDto> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(discount -> new DiscountDto(
                        discount.getId(),
                        discount.getDiscountType()
                ))
                .collect(Collectors.toList());
    }
}
