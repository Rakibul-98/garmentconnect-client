
const About = () => {
  const teamMembers = [
    {
      image: 'https://i.ibb.co.com/4p7zzjh/sadiya.jpg', // Replace with actual image URL
      name: 'Sadiya Akhter',
      role: 'UI/UX Designer and Front End Developer',
      description: 'Led the Front end part. Designed and developed user-friendly interfaces, focusing on creating visually appealing and responsive designs.',
    },
    {
      image: 'https://i.ibb.co.com/bQ9YhTC/profile.png', // Replace with actual image URL
      name: 'Rakibul Hasan',
      role: 'Back End Developer',
      description: 'Led the development of GarmentConnect, working on the backend (Node.js, MongoDB). Focused on secure messaging and scalable architecture.',
    },
    
  ];

  return (
    <div className=" p-6 mb-10 lg:mb-0">
      {/* Header and Description Section */}
      <div className=" mb-5">
        <section className="w-9/12 mx-auto text-center md:text-left">
          <h2 className="text-3xl font-semibold text-gray-800 mb-3">Our Mission and Vision</h2>
          <p className="text-gray-700 text-lg">
            GarmentConnect is a cutting-edge platform designed to connect buyers and sellers in the global garment industry. 
            Our goal is to simplify communication and collaboration by offering a seamless interface for sending offers, 
            managing responses, and building lasting business relationships. We are committed to bridging gaps in textile 
            commerce with secure and innovative solutions.
          </p>
        </section>
      </div>

      {/* Team Members Section */}
      <section className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="rounded-lg shadow-lg p-6 text-center flex flex-col items-center bg-slate-100 hover:bg-transparent hover:border"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4"
              />
              <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{member.role}</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
