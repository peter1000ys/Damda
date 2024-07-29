package back.shoppingMart.purchase.entity;

import back.shoppingMart.discount.DiscountType;
import back.shoppingMart.product.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurchaseProduct {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchaseProductId")
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "productId")
    private Product product;

    @JsonIgnore
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "purchaseId")
    private Purchase purchase;


    private int count;

    public double getTotalPrice() {
        double totalPrice = 0.0;
        double price = product.getProductPrice();
        DiscountType discount = product.getDiscount().getDiscountType();

        switch (discount) {
            case TEN:
                totalPrice = count * price * 0.9;
                break;
            case THIRTY:
                totalPrice = count * price * 0.7;
                break;
            case HALF:
                totalPrice = count * price * 0.5;
                break;
//            case ONE_PLUS_ONE:
//                totalPrice = (count / 2 + count % 2) * price;
//                break;
//            case TWO_PLUS_ONE:
//                totalPrice = (count / 3 * 2 + count % 3) * price;
//                break;
            case NONE:
            default:
                totalPrice = count * price;
                break;
        }

        return totalPrice;
    }


}
