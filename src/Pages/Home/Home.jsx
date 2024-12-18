import banner from '../../assets/banner.svg';

const Home = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between pt-7 px-20 mb-10 lg:mb-0">
      <div className="lg:w-1/2 text-center lg:text-left space-y-6">
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800">
          GarmentConnect
        </h1>
        <p className="text-lg lg:text-xl text-gray-600">
          Bridging the Gap in Global Textile Commerce
        </p>
        <p className="text-gray-500">
        Join our platform today and unlock a world of opportunities in the garment sector. Whether you&apos;re a buyer looking for quality suppliers or a seller aiming to expand your reach, our platform facilitates seamless connections and meaningful collaborations. With a user-friendly interface, you can easily navigate through various sectors and services, ensuring that your business needs are met with precision. Start building valuable partnerships and expand your network, all while growing your business effortlessly in the ever-evolving garment industry.
        </p>
      </div>

      <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center lg:justify-end">
        <img
          src={banner}
          alt="GarmentConnect Banner"
          className="w-full max-w-lg h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Home;
