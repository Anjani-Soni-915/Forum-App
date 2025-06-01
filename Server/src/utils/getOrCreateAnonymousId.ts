import { User } from "../models/user.model";

export default function getOrCreateAnonymousId(userId: number) : Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        where: { id: userId },
      });
      if (user?.anonymous_id) {
        resolve(user.anonymous_id);
      } else {
        const anonymousName = generateAnonymousUsername();
        User.update(
          {
            anonymous_id: anonymousName,
          },
          {
            where: { id: userId },
          }
        );
        resolve(anonymousName);
      }
    } catch (error) {
      reject(error);
      console.error("Error in finding anonymous name", error);
    }
  });
}

function generateAnonymousUsername(): string {
  const adjectives = ["Shy", "Brave", "Quiet", "Fast", "Lazy", "Happy"];
  const animals = ["Tiger", "Owl", "Penguin", "Fox", "Bear", "Wolf"];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit number

  return `${randomAdj}${randomAnimal}${randomNum}`;
}
