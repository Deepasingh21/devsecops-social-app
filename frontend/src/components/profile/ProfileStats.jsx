function ProfileStats({
  user,
  postCount,
  likeCount,
  onFollowersClick,
  onFollowingClick,
}) {
  const stats = [
    {
      label: "Posts",
      value: postCount,
      clickable: false,
    },
    {
      label: "Followers",
      value: user.followers?.length || 0,
      clickable: true,
      onClick: onFollowersClick,
    },
    {
      label: "Following",
      value: user.following?.length || 0,
      clickable: true,
      onClick: onFollowingClick,
    },
    {
      label: "Likes",
      value: likeCount,
      clickable: false,
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">

      {stats.map((item) => (
        <div
          key={item.label}
          onClick={item.clickable ? item.onClick : undefined}
          className={`text-center ${
            item.clickable
              ? "cursor-pointer hover:bg-gray-50 rounded-lg p-3"
              : "p-3"
          }`}
        >
          <h3 className="text-2xl font-bold">
            {item.value}
          </h3>

          <p className="text-gray-500 mt-2">
            {item.label}
          </p>
        </div>
      ))}

    </div>
  );
}

export default ProfileStats;
