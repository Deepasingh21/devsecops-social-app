function ProfileAbout({ user }) {
  const skills = [
    "AWS",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Jenkins",
    "Linux",
    "React",
    "Express.js",
    "MongoDB",
    "GitHub",
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6">
        About
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <p className="text-gray-500">Username</p>
          <h3 className="font-semibold">
            @{user.username}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Email</p>
          <h3 className="font-semibold">
            {user.email}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Bio</p>
          <h3 className="font-semibold">
            {user.bio || "No bio available"}
          </h3>
        </div>

        <div>
          <p className="text-gray-500">Joined</p>
          <h3 className="font-semibold">
            {new Date(user.createdAt).toLocaleDateString()}
          </h3>
        </div>

      </div>

      <h3 className="font-bold mt-8 mb-4">
        Skills
      </h3>

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProfileAbout;
