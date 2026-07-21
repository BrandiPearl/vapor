export default function PrivacyPage() {
  return (
    <div className="container-site max-w-3xl py-14 prose-shop">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-brand">
        Privacy Policy
      </h1>
      <div className="mt-8">
        <p>
          Aussie Cloud Vape collects personal information such as name, email,
          shipping address, and payment details solely to process orders and
          provide customer support.
        </p>
        <p>
          We do not sell your personal data. Information is stored securely and
          shared only with payment processors and shipping partners as required
          to fulfil your order.
        </p>
        <p>
          For privacy requests, email sales@aussiecloudvape.com.au. A complete
          privacy policy will ship with the Supabase-backed auth and checkout
          release.
        </p>
      </div>
    </div>
  );
}
