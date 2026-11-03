import './App.css';

import { useState, type FormEvent } from 'react';
import { CATEGORIES, PRODUCTS, formatPrice, type CartLine, type Category, type Product } from './products';

type View = 'collection' | 'details' | 'bag' | 'checkout' | 'confirmation';
type CheckoutFields = { name: string; email: string; address: string };
type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;
type CompletedOrder = { name: string; lines: CartLine[]; total: number };
export interface AppProps { title?: string; }

const EMPTY_FIELDS: CheckoutFields = { name: '', email: '', address: '' };

export function App({ title = 'Northline' }: AppProps) {
  const [view, setView] = useState<View>('collection');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [fields, setFields] = useState<CheckoutFields>(EMPTY_FIELDS);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [order, setOrder] = useState<CompletedOrder | null>(null);

  const visibleProducts = category === 'All' ? PRODUCTS : PRODUCTS.filter((product) => product.category === category);
  const selectedProduct = PRODUCTS.find((product) => product.id === selectedProductId);
  const cartCount = cart.reduce((count, line) => count + line.quantity, 0);
  const cartTotal = cart.reduce((total, line) => total + line.product.priceInCents * line.quantity, 0);

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) return current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line);
      return [...current, { product, quantity: 1 }];
    });
  }
  function changeQuantity(productId: string, change: number) {
    setCart((current) => current.map((line) => line.product.id === productId ? { ...line, quantity: line.quantity + change } : line).filter((line) => line.quantity > 0));
  }
  function removeFromCart(productId: string) { setCart((current) => current.filter((line) => line.product.id !== productId)); }
  function openDetails(product: Product) { setSelectedProductId(product.id); setView('details'); }
  function returnToCollection() { setSelectedProductId(null); setView('collection'); }
  function updateField(field: keyof CheckoutFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }
  function submitCheckout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: CheckoutErrors = {};
    if (!fields.name.trim()) nextErrors.name = 'Enter your full name.';
    if (!fields.email.trim()) nextErrors.email = 'Enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!fields.address.trim()) nextErrors.address = 'Enter a shipping address.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setOrder({ name: fields.name.trim(), lines: cart.map((line) => ({ ...line })), total: cartTotal });
    setView('confirmation');
  }
  function startAnotherOrder() {
    setCart([]); setFields(EMPTY_FIELDS); setErrors({}); setOrder(null); returnToCollection();
  }

  return (
    <div className="storefront">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="announcement">Considered clothing · made to wear on repeat</div>
      <header className="site-header">
        <button className="brand" onClick={returnToCollection} aria-label="Return to collection"><span className="brand-mark" aria-hidden="true">N.</span><span>{title}</span></button>
        <p className="header-note">Clothes to keep, made for the everyday.</p>
        <button className="bag-button" onClick={() => setView('bag')} aria-label={'Open bag, ' + cartCount + ' ' + (cartCount === 1 ? 'item' : 'items')}><span>Bag</span><span className="bag-count" aria-hidden="true">{cartCount}</span></button>
      </header>
      <main id="main-content" className="page-content">
        {view === 'collection' && <Collection
          category={category} setCategory={setCategory} products={visibleProducts}
          onOpen={openDetails} onAdd={addToCart} />}
        {view === 'details' && selectedProduct && <Details product={selectedProduct} onBack={returnToCollection} onAdd={() => addToCart(selectedProduct)} />}
        {view === 'bag' && <Bag cart={cart} total={cartTotal} count={cartCount} onBack={returnToCollection}
          onCheckout={() => setView('checkout')} onDecrease={(id) => changeQuantity(id, -1)}
          onIncrease={(id) => changeQuantity(id, 1)} onRemove={removeFromCart} />}
        {view === 'checkout' && <Checkout
          cart={cart} total={cartTotal} fields={fields} errors={errors} onBack={() => setView('bag')}
          onChange={updateField} onSubmit={submitCheckout} />}
        {view === 'confirmation' && order && <Confirmation order={order} onReturn={startAnotherOrder} />}
      </main>
      <footer className="site-footer"><span className="footer-brand">Northline</span><span>Considered clothing for the everyday.</span><span>Designed to wear on repeat.</span></footer>
    </div>
  );
}

function Collection({ category, setCategory, products, onOpen, onAdd }: {
  category: Category | 'All'; setCategory: (value: Category | 'All') => void; products: Product[];
  onOpen: (product: Product) => void; onAdd: (product: Product) => void;
}) {
  return (
    <section aria-labelledby="collection-heading">
      <div className="hero"><div className="hero-copy"><p className="eyebrow">A considered collection · 01 / 25</p>
        <h1 id="collection-heading">Less, but<br />loved longer.</h1>
        <p className="hero-description">Thoughtful layers, honest materials, and the pieces you reach for again.</p>
        <a className="text-link" href="#collection">Explore the collection <span aria-hidden="true">↘</span></a></div>
        <div className="hero-art" role="img" aria-label="Illustrated coat and scarf in warm seasonal colors">
          <span className="hero-sun" /><span className="hero-figure hero-coat" /><span className="hero-figure hero-scarf" />
          <span className="hero-caption">Made for<br />the long run.</span></div></div>
      <div className="collection-heading" id="collection"><div><p className="eyebrow">The edit</p><h2>Pieces with purpose</h2></div><p className="product-count">{products.length} pieces</p></div>
      <div className="filter-row" aria-label="Filter products by category"><div className="filters">
        {(['All', ...CATEGORIES] as const).map((item) => <button className={category === item ? 'filter-button active' : 'filter-button'}
          key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div><p className="filter-note">Designed to wear on repeat</p></div>
      {products.length === 0 ? <p className="empty-state">No pieces in this category just yet.</p> :
        <div className="product-grid">{products.map((product, index) => <ProductCard key={product.id} product={product} index={index}
          onOpen={() => onOpen(product)} onAdd={() => onAdd(product)} />)}</div>}
    </section>
  );
}

function ProductCard({ product, index, onOpen, onAdd }: {
  product: Product; index: number; onOpen: () => void; onAdd: () => void;
}) {
  return <article className="product-card"><div className="product-art-wrap">
    <button className="image-button" onClick={onOpen} aria-label={'View ' + product.name}><ProductImage product={product} className="product-image" /></button>
    <span className="product-index">{String(index + 1).padStart(2, '0')}</span>
    <button className="quick-add" onClick={onAdd} aria-label={'Add ' + product.name + ' to bag'}>+</button></div>
    <div className="product-meta"><div><p className="product-category">{product.category}</p>
      <h3><button className="product-title" onClick={onOpen}>{product.name}</button></h3></div>
      <span className="product-price">{formatPrice(product.priceInCents)}</span></div>
    <button className="mobile-add" onClick={onAdd}>Add to bag</button></article>;
}

function Details({ product, onBack, onAdd }: { product: Product; onBack: () => void; onAdd: () => void }) {
  return <section className="detail-view" aria-labelledby="detail-heading"><button className="back-link" onClick={onBack}>← Back to collection</button>
    <div className="detail-layout"><ProductImage product={product} className="detail-image" />
      <div className="detail-copy"><p className="eyebrow">{product.category} · Northline essentials</p><h1 id="detail-heading">{product.name}</h1>
        <p className="detail-price">{formatPrice(product.priceInCents)}</p><p className="detail-description">{product.description}</p>
        <p className="material-note">{product.material}</p>
        <button className="button button-dark add-detail" onClick={onAdd}>Add to bag <span>{formatPrice(product.priceInCents)}</span></button>
        <p className="detail-footnote">Easy returns · Made with care</p></div></div></section>;
}

function Bag({ cart, total, count, onBack, onCheckout, onDecrease, onIncrease, onRemove }: {
  cart: CartLine[]; total: number; count: number; onBack: () => void; onCheckout: () => void;
  onDecrease: (id: string) => void; onIncrease: (id: string) => void; onRemove: (id: string) => void;
}) {
  return <section className="bag-view" aria-labelledby="bag-heading"><div className="page-heading">
    <div><p className="eyebrow">Your selection</p><h1 id="bag-heading">Your bag <span className="heading-count">({count})</span></h1></div>
    <button className="back-link" onClick={onBack}>← Continue shopping</button></div>
    {cart.length === 0 ? <div className="empty-bag"><span className="empty-bag-mark" aria-hidden="true">N.</span>
      <h2>Your bag is taking a breather.</h2><p>There’s nothing here yet. Find something you’ll reach for often.</p>
      <button className="button button-dark" onClick={onBack}>Explore the collection</button>
      <div className="summary-line empty-bag-total"><span>Subtotal</span><output aria-label="Bag subtotal">{formatPrice(total)}</output></div></div> :
      <div className="bag-layout"><div className="bag-lines">{cart.map((line) => <CartLineItem key={line.product.id}
        line={line} onDecrease={() => onDecrease(line.product.id)} onIncrease={() => onIncrease(line.product.id)}
        onRemove={() => onRemove(line.product.id)} />)}</div>
        <aside className="order-summary" aria-label="Order summary"><p className="eyebrow">A little more detail</p>
          <div className="summary-line"><span>Subtotal</span><output aria-label="Bag subtotal">{formatPrice(total)}</output></div>
          <p className="summary-note">Shipping and taxes are not calculated in this demo.</p>
          <button className="button button-dark checkout-button" onClick={onCheckout}>Continue to checkout <span aria-hidden="true">→</span></button>
          <p className="secure-note"><span aria-hidden="true">✳</span> No payment is collected on this demo site.</p></aside></div>}
  </section>;
}

function CartLineItem({ line, onDecrease, onIncrease, onRemove }: {
  line: CartLine; onDecrease: () => void; onIncrease: () => void; onRemove: () => void;
}) {
  const { product, quantity } = line;
  return <article className="cart-line"><ProductImage product={product} className="cart-image" /><div className="cart-line-info">
    <p className="product-category">{product.category}</p><h2>{product.name}</h2>
    <p className="cart-unit-price">{formatPrice(product.priceInCents)} each</p>
    <div className="line-controls"><div className="quantity-control" aria-label={'Quantity of ' + product.name}>
      <button aria-label={'Decrease quantity of ' + product.name} onClick={onDecrease} disabled={quantity <= 1}>−</button>
      <span aria-live="polite" aria-atomic="true">{quantity}</span>
      <button aria-label={'Increase quantity of ' + product.name} onClick={onIncrease}>+</button></div>
      <button className="remove-button" onClick={onRemove}>Remove</button></div></div>
    <output className="line-total" aria-label={product.name + ' subtotal'}>{formatPrice(product.priceInCents * quantity)}</output></article>;
}

function Checkout({ cart, total, fields, errors, onBack, onChange, onSubmit }: {
  cart: CartLine[]; total: number; fields: CheckoutFields; errors: CheckoutErrors;
  onBack: () => void; onChange: (field: keyof CheckoutFields, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return <section className="checkout-view" aria-labelledby="checkout-heading"><button className="back-link" onClick={onBack}>← Back to bag</button>
    <div className="checkout-layout"><div><p className="eyebrow">Almost yours</p><h1 id="checkout-heading">Delivery details</h1>
      <p className="checkout-intro">A few details to complete this local demo checkout.</p>
      <form className="checkout-form" noValidate onSubmit={onSubmit}>
        <Field id="customer-name" label="Full name" value={fields.name} error={errors.name} autoComplete="name" onChange={(value) => onChange('name', value)} />
        <Field id="customer-email" label="Email address" value={fields.email} error={errors.email} autoComplete="email" type="email" onChange={(value) => onChange('email', value)} />
        <Field id="shipping-address" label="Shipping address" value={fields.address} error={errors.address} autoComplete="street-address" onChange={(value) => onChange('address', value)} />
        <button className="button button-dark place-order-button" type="submit">Place demo order <span>{formatPrice(total)}</span></button>
        <p className="form-note">This demo does not process payment or send or store an order.</p></form></div>
      <aside className="checkout-summary" aria-label="Your order"><p className="eyebrow">In your bag</p>
        {cart.map((line) => <div className="mini-line" key={line.product.id}><span>{line.product.name} <span className="mini-quantity">× {line.quantity}</span></span>
          <span>{formatPrice(line.product.priceInCents * line.quantity)}</span></div>)}
        <div className="summary-line checkout-total"><span>Total</span><output aria-label="Checkout total">{formatPrice(total)}</output></div></aside></div></section>;
}

function Field({ id, label, value, error, autoComplete, type = 'text', onChange }: {
  id: string; label: string; value: string; error?: string; autoComplete: string;
  type?: string; onChange: (value: string) => void;
}) {
  const errorId = id + '-error';
  return <div className={error ? 'form-field has-error' : 'form-field'}><label htmlFor={id}>{label}</label>
    <input id={id} name={id} type={type} value={value} autoComplete={autoComplete} required aria-invalid={Boolean(error)}
      aria-describedby={error ? errorId : undefined} onChange={(event) => onChange(event.target.value)} />
    {error && <p id={errorId} className="field-error" role="alert">{error}</p>}</div>;
}

function Confirmation({ order, onReturn }: { order: CompletedOrder; onReturn: () => void }) {
  return <section className="confirmation-view" aria-labelledby="confirmation-heading"><span className="confirmation-symbol" aria-hidden="true">✓</span>
    <p className="eyebrow">A lovely choice</p><h1 id="confirmation-heading">Demo order confirmed.</h1>
    <p className="confirmation-greeting">Thank you, {order.name}.</p>
    <p className="confirmation-note">This is a local demo only. No payment was processed, and no order was sent or stored.</p>
    <div className="confirmation-summary">{order.lines.map((line) => <div className="mini-line" key={line.product.id}>
      <span>{line.product.name} <span className="mini-quantity">× {line.quantity}</span></span>
      <span>{formatPrice(line.product.priceInCents * line.quantity)}</span></div>)}
      <div className="summary-line checkout-total"><span>Total</span><output aria-label="Confirmed total">{formatPrice(order.total)}</output></div></div>
    <button className="button button-dark" onClick={onReturn}>Back to the collection</button></section>;
}

function ProductImage({ product, className }: { product: Product; className: string }) {
  return <img className={className} src={product.image} alt={product.imageAlt} />;
}
