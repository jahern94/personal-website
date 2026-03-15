import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "Contact — Jack Ahern",
  description: "Get in touch with me. I'd love to hear from you!",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Get In Touch
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
        Have a question, want to work together, or just want to say hi? Drop me
        a message and I&apos;ll get back to you as soon as I can.
      </p>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <ContactForm />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Other Ways to Connect
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            You can also find me on these platforms:
          </p>
          <SocialLinks />
        </div>
      </div>
    </div>
  );
}
