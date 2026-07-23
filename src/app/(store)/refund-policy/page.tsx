type Props = {
  title: string;
  children: React.ReactNode;
};

function PolicyLayout({ title, children }: Props) {
  return (
    <div className="container-site max-w-3xl py-14 prose-shop">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-brand">
        {title}
      </h1>
      <div className="mt-8">{children}</div>
    </div>
  );
}

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy">
      <p>
        If you receive a damaged or incorrect product, contact us within 7 days
        of delivery with your order number and photos. Approved refunds or
        replacements are processed after verification. Opened nicotine products
        may not be eligible for return unless faulty.
      </p>
      <p>
        Shipping delays caused by carriers are not grounds for a refund once the
        order has been dispatched. Contact sales@aussiecloudvape.com.au for
        support.
      </p>
    </PolicyLayout>
  );
}
