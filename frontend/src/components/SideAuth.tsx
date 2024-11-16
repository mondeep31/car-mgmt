const SideAuth = () => {
  return (
    <div className="relative hidden lg:block bg-gray-100">
      <div className="relative h-screen flex flex-col items-center justify-center px-8">
        <div className="mb-12">
          <img src="/logo.webp" alt="Company Logo" className="h-8 w-auto" />
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            The Future of <span>Automotive Retail</span>.
          </h1>

          <p className="text-lg text-gray-700 max-w-md">
            AI-Powered Car Photography Solutions for Dealerships
            <br />& Marketplaces
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideAuth;
