import { usePluginData } from "@docusaurus/useGlobalData";
import React from "react";
import Layout from "@theme/Layout";

import { format } from "date-fns";

type Changelog = {
  slug: string;
  frontmatter: {
    date: string;
    title: string;
    version: string;
    description?: string;
    ogImage: string;
    slug: string;
  };
  body: string;
};

const Changelog = () => {
  const data = usePluginData("changelog-list") as any[];

  return (
    <Layout title="Changelog">
      <main>
        <div className="w-full lg:w-1/2 mx-auto text-center mt-16">
          <h2 className="text-4xl font-grotesk">Contact us</h2>
          <p className="text-black/60 dark:text-white/60 text-lg">
            Let's work together and make something great.
          </p>
        </div>
        <div className="relative">
          <div className="lg:absolute lg:inset-0">
            <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80"
                className="h-56 w-full object-cover lg:absolute lg:h-full"
              />
            </div>
          </div>
          <div className="relative px-6 py-16 sm:py-24 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:px-8 lg:py-32">
            <div className="lg:pr-8">
              <div className="mx-auto max-w-md sm:max-w-lg lg:mx-0">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Let's work together</h2>
                <p className="mt-4 text-lg text-black/60 dark:text-white/60 sm:mt-3">
                  We’d love to hear from you! Send us a message using the form opposite, or email us. We’d love to hear
                  from you! Send us a message using the form opposite, or email us.
                </p>
                <form action="#" method="POST" className="mt-9 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                  <div>
                    <label htmlFor="first-name" className="block text-sm font-medium text-black/60 dark:text-white/60">
                      First name
                    </label>
                    <div className="mt-1">
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        className="block w-full text-black/60 rounded-md border-gray-300 shadow-sm focus:border-[#178462] focus:ring-[#178462] sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="last-name" className="block text-sm font-medium text-black/60 dark:text-white/60">
                      Last name
                    </label>
                    <div className="mt-1">
                      <input
                        id="last-name"
                        name="last-name"
                        type="text"
                        autoComplete="family-name"
                        className="block w-full text-black/60 rounded-md border-gray-300 shadow-sm focus:border-[#178462] focus:ring-[#178462] sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-black/60 dark:text-white/60">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full text-black/60 rounded-md border-gray-300 shadow-sm focus:border-[#178462] focus:ring-[#178462] sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="company" className="block text-sm font-medium text-black/60 dark:text-white/60">
                      Company
                    </label>
                    <div className="mt-1">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        className="block w-full text-black/60 rounded-md border-gray-300 shadow-sm focus:border-[#178462] focus:ring-[#178462] sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex justify-between">
                      <label htmlFor="phone" className="block text-sm font-medium text-black/60 dark:text-white/60">
                        Phone
                      </label>
                      <span id="phone-description" className="text-sm text-black/60 dark:text-white/60">
                        Optional
                      </span>
                    </div>
                    <div className="mt-1">
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        autoComplete="tel"
                        aria-describedby="phone-description"
                        className="block w-full text-black/60 rounded-md border-gray-300 shadow-sm focus:border-[#178462] focus:ring-[#178462] sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex justify-between">
                      <label htmlFor="how-can-we-help" className="block text-sm font-medium text-black/60 dark:text-white/60">
                        How can we help you?
                      </label>
                      <span id="how-can-we-help-description" className="text-sm text-black/60 dark:text-white/60">
                        Max. 500 characters
                      </span>
                    </div>
                    <div className="mt-1">
                      <textarea
                        id="how-can-we-help"
                        name="how-can-we-help"
                        rows={4}
                        aria-describedby="how-can-we-help-description"
                        className="block w-full text-black/60 rounded-md border-gray-300 shadow-sm focus:border-[#178462] focus:ring-[#178462] sm:text-sm"
                        defaultValue={''}
                      />
                    </div>
                  </div>
                  <fieldset className="sm:col-span-2">
                    <legend className="block text-sm font-medium text-black/60 dark:text-white/60">Expected budget</legend>
                    <div className="mt-4 grid grid-cols-1 gap-y-4">
                      <div className="flex items-center">
                        <input
                          defaultValue="under_25k"
                          id="budget-under-25k"
                          name="budget"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-[#178462] focus:ring-[#178462]"
                        />
                        <label htmlFor="budget-under-25k" className="ml-3">
                          <span className="block text-sm text-black/60 dark:text-white/60">Less than $25K</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          defaultValue="25k-50k"
                          id="budget-25k-50k"
                          name="budget"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-[#178462] focus:ring-[#178462]"
                        />
                        <label htmlFor="budget-25k-50k" className="ml-3">
                          <span className="block text-sm text-black/60 dark:text-white/60">$25K – $50K</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          defaultValue="50k-100k"
                          id="budget-50k-100k"
                          name="budget"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-[#178462] focus:ring-[#178462]"
                        />
                        <label htmlFor="budget-50k-100k" className="ml-3">
                          <span className="block text-sm text-black/60 dark:text-white/60">$50K – $100K</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          defaultValue="over_100k"
                          id="budget-over-100k"
                          name="budget"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-[#178462] focus:ring-[#178462]"
                        />
                        <label htmlFor="budget-over-100k" className="ml-3">
                          <span className="block text-sm text-black/60 dark:text-white/60">$100K+</span>
                        </label>
                      </div>
                    </div>
                  </fieldset>
                  <div className="sm:col-span-2">
                    <label htmlFor="how-did-you-hear-about-us" className="block text-sm font-medium text-black/60 dark:text-white/60">
                      How did you hear about us?
                    </label>
                    <div className="mt-1">
                      <input
                        id="how-did-you-hear-about-us"
                        name="how-did-you-hear-about-us"
                        type="text"
                        className="block w-full text-black/60 rounded-md border-gray-300 shadow-sm focus:border-[#178462] focus:ring-[#178462] sm:text-sm"
                      />
                    </div>
                  </div>
                  <div className="text-right sm:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#178462] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-[#178462] focus:ring-offset-2"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Changelog;
