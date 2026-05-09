export type Challenge = {
  category: string;
  prompt: string;
  proof: string;
};

export const challenges: Challenge[] = [
  {
    category: "Alphabet Chaos",
    prompt: "First person to touch a thing starting with the letter A wins.",
    proof: "Show the object and say its name like it is important.",
  },
  {
    category: "Alphabet Chaos",
    prompt: "First person to touch a thing starting with the letter B wins.",
    proof: "Show the object and defend why it counts.",
  },
  {
    category: "Alphabet Chaos",
    prompt:
      "First person to find something that starts with the same letter as their name wins.",
    proof: "Show it and say, 'This represents me now.'",
  },
  {
    category: "Alphabet Chaos",
    prompt:
      "First person to find something that starts with the same letter as the other person’s name wins.",
    proof: "Show it and explain why destiny clearly arranged this.",
  },
  {
    category: "Alphabet Chaos",
    prompt: "First person to find three things that start with the same letter wins.",
    proof: "Show all three like you are presenting evidence in court.",
  },
  {
    category: "Animal-ish",
    prompt: "First person to take a photo of a fish, real or fake, wins.",
    proof:
      "Show the fish. Logo, statue, menu, tattoo, toy, painting, anything counts.",
  },
  {
    category: "Animal-ish",
    prompt: "First person to find a bird, real or fake, wins.",
    proof: "Show it and give it a suspicious name.",
  },
  {
    category: "Animal-ish",
    prompt: "First person to find an animal that is absolutely not alive wins.",
    proof: "Show it. Toy, drawing, sign, statue, logo, cursed souvenir, whatever.",
  },
  {
    category: "Animal-ish",
    prompt:
      "First person to find something that looks like it could bite you emotionally wins.",
    proof: "Show it and explain the emotional damage.",
  },
  {
    category: "Animal-ish",
    prompt: "First person to find an animal and make up its job title wins.",
    proof: "Show it and announce its position.",
  },
  {
    category: "Object Crimes",
    prompt: "First person to find something that looks guilty wins.",
    proof: "Show it and say what it did.",
  },
  {
    category: "Object Crimes",
    prompt: "First person to find something that looks like it has tax problems wins.",
    proof: "Show it and explain the audit.",
  },
  {
    category: "Object Crimes",
    prompt: "First person to find something that looks like it knows your secrets wins.",
    proof: "Show it and say, 'It knows too much.'",
  },
  {
    category: "Object Crimes",
    prompt:
      "First person to find something that looks like it would lie on a résumé wins.",
    proof: "Show it and reveal the fake credential.",
  },
  {
    category: "Object Crimes",
    prompt: "First person to find something that looks like it has a lawyer wins.",
    proof: "Show it and explain the pending case.",
  },
  {
    category: "Object Crimes",
    prompt:
      "First person to find something that looks banned in at least three countries wins.",
    proof: "Show it and name one fake country where it is illegal.",
  },
  {
    category: "Speed Run",
    prompt: "First person to bring a spoon wins.",
    proof: "Show the spoon like it is Excalibur.",
  },
  {
    category: "Speed Run",
    prompt: "First person to bring something with a barcode wins.",
    proof: "Show the barcode and say, 'Capitalism found me.'",
  },
  {
    category: "Speed Run",
    prompt:
      "First person to bring something useless but emotionally important wins.",
    proof: "Show it and explain why your soul refuses to throw it away.",
  },
  {
    category: "Speed Run",
    prompt: "First person to bring something they bought but did not need wins.",
    proof: "Show it and confess with dignity.",
  },
  {
    category: "Speed Run",
    prompt: "First person to bring something that smells good wins.",
    proof:
      "Show it and rate the smell like a dramatic perfume reviewer.",
  },
  {
    category: "Speed Run",
    prompt:
      "First person to bring something you would pack for a fake emergency wins.",
    proof: "Show it and explain the emergency.",
  },
  {
    category: "Tiny Cinema",
    prompt: "First person to take a photo that looks like an album cover wins.",
    proof: "Show the photo and name the album.",
  },
  {
    category: "Tiny Cinema",
    prompt:
      "First person to photograph something that looks like the beginning of a movie wins.",
    proof: "Show the photo and say the opening line.",
  },
  {
    category: "Tiny Cinema",
    prompt: "First person to find something that looks like a villain owns it wins.",
    proof: "Show it and name the villain.",
  },
  {
    category: "Tiny Cinema",
    prompt:
      "First person to find something that looks like a romantic comedy prop wins.",
    proof: "Show it and explain the scene.",
  },
  {
    category: "Tiny Cinema",
    prompt:
      "First person to find something that looks like it belongs in a murder mystery wins.",
    proof: "Show it and say who found it.",
  },
  {
    category: "Tiny Cinema",
    prompt: "First person to find dramatic lighting wins.",
    proof: "Show it and act like you discovered cinema.",
  },
  {
    category: "Flirty Chaos",
    prompt:
      "First person to find something that says 'I like you' without saying it wins.",
    proof:
      "Show it and explain without being too smooth. Suspicious smoothness will be judged.",
  },
  {
    category: "Flirty Chaos",
    prompt: "First person to find something that reminds them of the other person wins.",
    proof: "Show it and explain. Bonus dignity if it is not a candle.",
  },
  {
    category: "Flirty Chaos",
    prompt:
      "First person to find something they would give the other person if the budget was $7 wins.",
    proof: "Show it and sell the romance.",
  },
  {
    category: "Flirty Chaos",
    prompt:
      "First person to find something that belongs in your imaginary shared kitchen wins.",
    proof: "Show it and explain why the kitchen has taste.",
  },
  {
    category: "Flirty Chaos",
    prompt: "First person to find something that would become an inside joke wins.",
    proof: "Show it and name the joke.",
  },
  {
    category: "Flirty Chaos",
    prompt:
      "First person to find something that would make this date memorable wins.",
    proof:
      "Show it and explain like a person with feelings but not a LinkedIn post.",
  },
  {
    category: "Touch Grass",
    prompt: "First person to touch something green wins.",
    proof: "Show it. Bonus respect if it is actually grass.",
  },
  {
    category: "Touch Grass",
    prompt: "First person to touch something older than both of you wins.",
    proof: "Show it and explain the ancient lore.",
  },
  {
    category: "Touch Grass",
    prompt: "First person to touch something wooden wins.",
    proof: "Show it and knock on it for legal protection.",
  },
  {
    category: "Touch Grass",
    prompt: "First person to touch something metal wins.",
    proof: "Show it and say whether it feels trustworthy.",
  },
  {
    category: "Touch Grass",
    prompt: "First person to touch something soft wins.",
    proof: "Show it and rate softness from cloud to sad towel.",
  },
  {
    category: "Touch Grass",
    prompt: "First person to touch something cold wins.",
    proof: "Show it and describe the emotional temperature.",
  },
  {
    category: "Cursed Objects",
    prompt: "First person to find a suspicious chair wins.",
    proof:
      "Show the chair and explain why nobody should sit there after midnight.",
  },
  {
    category: "Cursed Objects",
    prompt: "First person to find something that looks divorced wins.",
    proof:
      "Show it and explain respectfully. We are laughing with the object, not at it.",
  },
  {
    category: "Cursed Objects",
    prompt: "First person to find something that peaked in high school wins.",
    proof: "Show it and say what sport it played.",
  },
  {
    category: "Cursed Objects",
    prompt: "First person to find something with side-quest energy wins.",
    proof: "Show it and explain the mission.",
  },
  {
    category: "Cursed Objects",
    prompt: "First person to find something that looks like bad dating advice wins.",
    proof: "Show it and say the advice.",
  },
  {
    category: "Cursed Objects",
    prompt:
      "First person to find something that looks like it would text 'you up?' at 1:37 AM wins.",
    proof: "Show it and block it emotionally.",
  },
  {
    category: "Colors With Drama",
    prompt: "First person to find something red wins.",
    proof: "Show it and say whether it is passionate or threatening.",
  },
  {
    category: "Colors With Drama",
    prompt: "First person to find something blue wins.",
    proof: "Show it and say whether it is calm or emotionally unavailable.",
  },
  {
    category: "Colors With Drama",
    prompt: "First person to find something gold wins.",
    proof: "Show it and pretend it is priceless.",
  },
  {
    category: "Colors With Drama",
    prompt: "First person to find something pink wins.",
    proof: "Show it and say if it is cute or dangerously cute.",
  },
  {
    category: "Colors With Drama",
    prompt: "First person to find something black wins.",
    proof: "Show it and explain why it has main character trauma.",
  },
  {
    category: "Colors With Drama",
    prompt:
      "First person to find something the exact color of their current mood wins.",
    proof: "Show it and explain the emotional palette.",
  },
  {
    category: "Mini Debates",
    prompt:
      "First person to find an object and argue why it is secretly sexy wins.",
    proof: "Show it and make the case. Keep it classy, professor.",
  },
  {
    category: "Mini Debates",
    prompt:
      "First person to find an object and argue why it deserves a raise wins.",
    proof: "Show it and explain its contribution to society.",
  },
  {
    category: "Mini Debates",
    prompt:
      "First person to find an object and argue why it should be illegal wins.",
    proof: "Show it and present the charges.",
  },
  {
    category: "Mini Debates",
    prompt:
      "First person to find an object and argue why it would survive a zombie apocalypse wins.",
    proof: "Show it and explain its survival strategy.",
  },
  {
    category: "Mini Debates",
    prompt:
      "First person to find an object and argue why it has emotional intelligence wins.",
    proof: "Show it and cite absolutely no sources.",
  },
  {
    category: "Main Character Errands",
    prompt: "First person to find something that looks like a portal wins.",
    proof: "Show it and say where it goes.",
  },
  {
    category: "Main Character Errands",
    prompt: "First person to find something that feels like a secret wins.",
    proof: "Show it and refuse to elaborate.",
  },
  {
    category: "Main Character Errands",
    prompt: "First person to find something that should have its own theme song wins.",
    proof: "Show it and hum the theme.",
  },
  {
    category: "Main Character Errands",
    prompt: "First person to find something that would confuse an alien wins.",
    proof: "Show it and explain Earth poorly.",
  },
  {
    category: "Main Character Errands",
    prompt: "First person to find something that looks like a tiny monument wins.",
    proof: "Show it and announce what it commemorates.",
  },
  {
    category: "Main Character Errands",
    prompt: "First person to find something that feels like a plot twist wins.",
    proof: "Show it and say, 'That is when everything changed.'",
  },
  {
    category: "Tiny Art School",
    prompt: "First person to make a face using nearby objects wins.",
    proof: "Show the face and name it.",
  },
  {
    category: "Tiny Art School",
    prompt: "First person to create a tiny sculpture using three objects wins.",
    proof: "Show the sculpture and title it like modern art.",
  },
  {
    category: "Tiny Art School",
    prompt: "First person to turn a boring object into a luxury product wins.",
    proof: "Show it and give it a fake brand name.",
  },
  {
    category: "Tiny Art School",
    prompt: "First person to make a random object look romantic wins.",
    proof: "Show it with full commitment.",
  },
  {
    category: "Tiny Art School",
    prompt: "First person to create a fake movie prop wins.",
    proof: "Show it and name the movie.",
  },
  {
    category: "Soft Chaos",
    prompt: "First person to find something that reminds them of being a kid wins.",
    proof: "Show it and explain.",
  },
  {
    category: "Soft Chaos",
    prompt: "First person to find something they would have loved at age 10 wins.",
    proof: "Show it and explain why younger you had taste.",
  },
  {
    category: "Soft Chaos",
    prompt: "First person to find something that feels like comfort wins.",
    proof: "Show it and explain.",
  },
  {
    category: "Soft Chaos",
    prompt: "First person to find something that feels like a Sunday morning wins.",
    proof: "Show it and explain the vibe.",
  },
  {
    category: "Soft Chaos",
    prompt:
      "First person to find something that would make their mom say, 'That is nice,' wins.",
    proof: "Show it and imitate the approval.",
  },
  {
    category: "Public Nonsense",
    prompt: "First person to find a sign that feels bossy wins.",
    proof: "Show it and read it dramatically.",
  },
  {
    category: "Public Nonsense",
    prompt: "First person to find the worst font nearby wins.",
    proof: "Show it and roast it gently.",
  },
  {
    category: "Public Nonsense",
    prompt: "First person to find something trying too hard wins.",
    proof: "Show it and explain.",
  },
  {
    category: "Public Nonsense",
    prompt:
      "First person to find something extremely normal and make it sound mysterious wins.",
    proof: "Show it and narrate.",
  },
  {
    category: "Public Nonsense",
    prompt: "First person to find something that screams 'small town drama' wins.",
    proof: "Show it and invent the scandal.",
  },
  {
    category: "Final Boss Energy",
    prompt: "First person to find the most powerful object nearby wins.",
    proof: "Show it and explain its power.",
  },
  {
    category: "Final Boss Energy",
    prompt: "First person to find the weakest object nearby wins.",
    proof: "Show it and explain why it would not survive winter.",
  },
  {
    category: "Final Boss Energy",
    prompt:
      "First person to find something that could be worshipped by a tiny civilization wins.",
    proof: "Show it and name the civilization.",
  },
  {
    category: "Final Boss Energy",
    prompt:
      "First person to find something that feels like the final item in a video game wins.",
    proof: "Show it and explain what it unlocks.",
  },
  {
    category: "Final Boss Energy",
    prompt: "First person to find something that deserves dramatic music wins.",
    proof: "Show it and make the sound.",
  },
];
