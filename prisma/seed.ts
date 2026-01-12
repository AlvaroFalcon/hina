import { PrismaClient, CharacterType } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed script to populate the database with minimal required data.
 * Includes basic Hiragana and Katakana characters organized into progressive learning modules.
 */
async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  await prisma.moduleCharacter.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.module.deleteMany();
  await prisma.character.deleteMany();

  // Create Hiragana characters
  console.log("📝 Creating Hiragana characters...");
  const hiraganaCharacters = [
    // Vocales
    { character: "あ", reading: "a", type: CharacterType.HIRAGANA, order: 1 },
    { character: "い", reading: "i", type: CharacterType.HIRAGANA, order: 2 },
    { character: "う", reading: "u", type: CharacterType.HIRAGANA, order: 3 },
    { character: "え", reading: "e", type: CharacterType.HIRAGANA, order: 4 },
    { character: "お", reading: "o", type: CharacterType.HIRAGANA, order: 5 },
    // K-line
    { character: "か", reading: "ka", type: CharacterType.HIRAGANA, order: 6 },
    { character: "き", reading: "ki", type: CharacterType.HIRAGANA, order: 7 },
    { character: "く", reading: "ku", type: CharacterType.HIRAGANA, order: 8 },
    { character: "け", reading: "ke", type: CharacterType.HIRAGANA, order: 9 },
    { character: "こ", reading: "ko", type: CharacterType.HIRAGANA, order: 10 },
    // S-line
    { character: "さ", reading: "sa", type: CharacterType.HIRAGANA, order: 11 },
    {
      character: "し",
      reading: "shi",
      type: CharacterType.HIRAGANA,
      order: 12,
    },
    { character: "す", reading: "su", type: CharacterType.HIRAGANA, order: 13 },
    { character: "せ", reading: "se", type: CharacterType.HIRAGANA, order: 14 },
    { character: "そ", reading: "so", type: CharacterType.HIRAGANA, order: 15 },
    // T-line
    { character: "た", reading: "ta", type: CharacterType.HIRAGANA, order: 16 },
    {
      character: "ち",
      reading: "chi",
      type: CharacterType.HIRAGANA,
      order: 17,
    },
    {
      character: "つ",
      reading: "tsu",
      type: CharacterType.HIRAGANA,
      order: 18,
    },
    { character: "て", reading: "te", type: CharacterType.HIRAGANA, order: 19 },
    { character: "と", reading: "to", type: CharacterType.HIRAGANA, order: 20 },
    // N-line
    { character: "な", reading: "na", type: CharacterType.HIRAGANA, order: 21 },
    { character: "に", reading: "ni", type: CharacterType.HIRAGANA, order: 22 },
    { character: "ぬ", reading: "nu", type: CharacterType.HIRAGANA, order: 23 },
    { character: "ね", reading: "ne", type: CharacterType.HIRAGANA, order: 24 },
    { character: "の", reading: "no", type: CharacterType.HIRAGANA, order: 25 },
  ];

  const createdHiragana = await Promise.all(
    hiraganaCharacters.map((char) =>
      prisma.character.create({
        data: char,
      })
    )
  );

  // Create Katakana characters
  console.log("📝 Creating Katakana characters...");
  const katakanaCharacters = [
    // Vocales
    { character: "ア", reading: "a", type: CharacterType.KATAKANA, order: 1 },
    { character: "イ", reading: "i", type: CharacterType.KATAKANA, order: 2 },
    { character: "ウ", reading: "u", type: CharacterType.KATAKANA, order: 3 },
    { character: "エ", reading: "e", type: CharacterType.KATAKANA, order: 4 },
    { character: "オ", reading: "o", type: CharacterType.KATAKANA, order: 5 },
    // K-line
    { character: "カ", reading: "ka", type: CharacterType.KATAKANA, order: 6 },
    { character: "キ", reading: "ki", type: CharacterType.KATAKANA, order: 7 },
    { character: "ク", reading: "ku", type: CharacterType.KATAKANA, order: 8 },
    { character: "ケ", reading: "ke", type: CharacterType.KATAKANA, order: 9 },
    { character: "コ", reading: "ko", type: CharacterType.KATAKANA, order: 10 },
    // S-line
    { character: "サ", reading: "sa", type: CharacterType.KATAKANA, order: 11 },
    {
      character: "シ",
      reading: "shi",
      type: CharacterType.KATAKANA,
      order: 12,
    },
    { character: "ス", reading: "su", type: CharacterType.KATAKANA, order: 13 },
    { character: "セ", reading: "se", type: CharacterType.KATAKANA, order: 14 },
    { character: "ソ", reading: "so", type: CharacterType.KATAKANA, order: 15 },
    // T-line
    { character: "タ", reading: "ta", type: CharacterType.KATAKANA, order: 16 },
    {
      character: "チ",
      reading: "chi",
      type: CharacterType.KATAKANA,
      order: 17,
    },
    {
      character: "ツ",
      reading: "tsu",
      type: CharacterType.KATAKANA,
      order: 18,
    },
    { character: "テ", reading: "te", type: CharacterType.KATAKANA, order: 19 },
    { character: "ト", reading: "to", type: CharacterType.KATAKANA, order: 20 },
    // N-line
    { character: "ナ", reading: "na", type: CharacterType.KATAKANA, order: 21 },
    { character: "ニ", reading: "ni", type: CharacterType.KATAKANA, order: 22 },
    { character: "ヌ", reading: "nu", type: CharacterType.KATAKANA, order: 23 },
    { character: "ネ", reading: "ne", type: CharacterType.KATAKANA, order: 24 },
    { character: "ノ", reading: "no", type: CharacterType.KATAKANA, order: 25 },
  ];

  const createdKatakana = await Promise.all(
    katakanaCharacters.map((char) =>
      prisma.character.create({
        data: char,
      })
    )
  );

  // Create modules
  console.log("📚 Creating learning modules...");

  // Hiragana Module 1: Vocales
  const module1 = await prisma.module.create({
    data: {
      name: "Hiragana - Vocales",
      order: 1,
    },
  });

  // Hiragana Module 2: K-line
  const module2 = await prisma.module.create({
    data: {
      name: "Hiragana - K-line",
      order: 2,
    },
  });

  // Hiragana Module 3: S-line
  const module3 = await prisma.module.create({
    data: {
      name: "Hiragana - S-line",
      order: 3,
    },
  });

  // Hiragana Module 4: T-line
  const module4 = await prisma.module.create({
    data: {
      name: "Hiragana - T-line",
      order: 4,
    },
  });

  // Hiragana Module 5: N-line
  const module5 = await prisma.module.create({
    data: {
      name: "Hiragana - N-line",
      order: 5,
    },
  });

  // Katakana Module 1: Vocales
  const module6 = await prisma.module.create({
    data: {
      name: "Katakana - Vocales",
      order: 6,
    },
  });

  // Katakana Module 2: K-line
  const module7 = await prisma.module.create({
    data: {
      name: "Katakana - K-line",
      order: 7,
    },
  });

  // Katakana Module 3: S-line
  const module8 = await prisma.module.create({
    data: {
      name: "Katakana - S-line",
      order: 8,
    },
  });

  // Katakana Module 4: T-line
  const module9 = await prisma.module.create({
    data: {
      name: "Katakana - T-line",
      order: 9,
    },
  });

  // Katakana Module 5: N-line
  const module10 = await prisma.module.create({
    data: {
      name: "Katakana - N-line",
      order: 10,
    },
  });

  // Create ModuleCharacter relationships
  console.log("🔗 Creating module-character relationships...");

  // Hiragana Module 1: Vocales (あいうえお)
  await Promise.all(
    createdHiragana.slice(0, 5).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module1.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Hiragana Module 2: K-line (かきくけこ)
  await Promise.all(
    createdHiragana.slice(5, 10).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module2.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Hiragana Module 3: S-line (さしすせそ)
  await Promise.all(
    createdHiragana.slice(10, 15).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module3.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Hiragana Module 4: T-line (たちつてと)
  await Promise.all(
    createdHiragana.slice(15, 20).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module4.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Hiragana Module 5: N-line (なにぬねの)
  await Promise.all(
    createdHiragana.slice(20, 25).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module5.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Katakana Module 1: Vocales (アイウエオ)
  await Promise.all(
    createdKatakana.slice(0, 5).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module6.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Katakana Module 2: K-line (カキクケコ)
  await Promise.all(
    createdKatakana.slice(5, 10).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module7.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Katakana Module 3: S-line (サシスセソ)
  await Promise.all(
    createdKatakana.slice(10, 15).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module8.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Katakana Module 4: T-line (タチツテト)
  await Promise.all(
    createdKatakana.slice(15, 20).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module9.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  // Katakana Module 5: N-line (ナニヌネノ)
  await Promise.all(
    createdKatakana.slice(20, 25).map((char, index) =>
      prisma.moduleCharacter.create({
        data: {
          moduleId: module10.id,
          characterId: char.id,
          order: index + 1,
        },
      })
    )
  );

  console.log("✅ Seed completed successfully!");
  console.log(`📊 Created:`);
  console.log(`   - ${createdHiragana.length} Hiragana characters`);
  console.log(`   - ${createdKatakana.length} Katakana characters`);
  console.log(`   - 10 learning modules`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
