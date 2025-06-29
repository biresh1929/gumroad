import cx from "classnames";
import * as React from "react";

import { CardProduct, Ratings } from "$app/parsers/product";
import { formatOrderOfMagnitude } from "$app/utils/formatOrderOfMagnitude";

import { Icon } from "$app/components/Icons";
import { AuthorByline } from "$app/components/Product/AuthorByline";
import { PriceTag } from "$app/components/Product/PriceTag";
import { Thumbnail } from "$app/components/Product/Thumbnail";
import { Button } from "$app/components/Button";

export const Card = ({
  product,
  badge,
  footerAction,
  onAddToCart,
}: {
  product: CardProduct;
  badge?: React.ReactNode;
  footerAction?: React.ReactNode;
  onAddToCart?: (product: CardProduct) => void;
}) => {
  const [added, setAdded] = React.useState(false);
  const showCheck = added;


 return (
  <article className="product-card" style={{ position: "relative" }}>
    <figure>
      <Thumbnail url={product.thumbnail_url} nativeType={product.native_type} />
    </figure>


<Button
  onClick={(e) => {
    e.stopPropagation();       // ✅ Prevent click from reaching stretched-link
    e.preventDefault();
    onAddToCart?.(product);
    setAdded(true);
  }}
  variant="ghost"
  className="absolute bottom-2 right-2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-transform duration-150 active:scale-95"
  aria-label="Add to cart"
>
 {showCheck ? (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 text-green-600"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
) : (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    className="w-5 h-5 text-white"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
)}

</Button>


    {product.quantity_remaining != null ? <div className="ribbon">{`${product.quantity_remaining} left`}</div> : null}
    <header>
      <a href={product.url} className="stretched-link">
        <h4 itemProp="name">{product.name}</h4>
      </a>
      {product.seller ? (
        <AuthorByline
          name={product.seller.name}
          profileUrl={product.seller.profile_url}
          avatarUrl={product.seller.avatar_url ?? undefined}
        />
      ) : null}
      {product.ratings?.count ? <Rating ratings={product.ratings} /> : null}
    </header>
    <footer>
      <PriceTag
        url={product.url}
        currencyCode={product.currency_code}
        price={product.price_cents}
        isPayWhatYouWant={product.is_pay_what_you_want}
        isSalesLimited={product.is_sales_limited}
        recurrence={
          product.recurrence ? { id: product.recurrence, duration_in_months: product.duration_in_months } : undefined
        }
        creatorName={product.seller?.name}
      />
      {footerAction}
    </footer>
    {badge}
  </article>
);
};
export const HorizontalCard = ({ product, big }: { product: CardProduct; big?: boolean }) => (
  <article className={cx("product-card horizontal", { big })} style={{ position: "relative" }}>
    <figure>
      <Thumbnail url={product.thumbnail_url} nativeType={product.native_type} />
    </figure>
    {product.quantity_remaining != null ? <div className="ribbon">{product.quantity_remaining} left</div> : null}
    <section>
      <header>
        <a href={product.url} className="stretched-link" draggable="false">
          {big ? <h2 itemProp="name">{product.name}</h2> : <h3 itemProp="name">{product.name}</h3>}
        </a>
        <small>{product.description}</small>
        {product.seller ? (
          <AuthorByline
            name={product.seller.name}
            profileUrl={product.seller.profile_url}
            avatarUrl={product.seller.avatar_url ?? undefined}
          />
        ) : null}
      </header>
      <footer>
        <PriceTag
          url={product.url}
          currencyCode={product.currency_code}
          price={product.price_cents}
          isPayWhatYouWant={product.is_pay_what_you_want}
          isSalesLimited={product.is_sales_limited}
          recurrence={
            product.recurrence ? { id: product.recurrence, duration_in_months: product.duration_in_months } : undefined
          }
          creatorName={product.seller?.name}
        />
        {product.ratings?.count ? <Rating ratings={product.ratings} /> : null}
      </footer>
    </section>
  </article>
);

const Rating = ({ ratings, style }: { ratings: Ratings; style?: React.CSSProperties }) => (
  <div className="rating" aria-label="Rating" style={style}>
    <Icon name="solid-star" />
    <span className="rating-average">{ratings.average.toFixed(1)}</span>
    <span title={`${ratings.average} ${ratings.average === 1 ? "rating" : "ratings"}`}>
      {`(${formatOrderOfMagnitude(ratings.count, 1)})`}
    </span>
  </div>
);
