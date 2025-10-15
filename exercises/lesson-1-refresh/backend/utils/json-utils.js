const fs = require('fs');           // pour les sync
const fsp = require('fs').promises; // pour les async
const path = require('path');

// 💡 1. Définition du chemin par défaut pour l'initialisation
// Le chemin est absolu et remonte au dossier parent du répertoire de code.
const EXPENSES_INIT_PATH = path.join(
  __dirname,
  "..",
  "data",
  "expenses.init.json"
);

/**
 * Lit et analyse un fichier JSON en objet JavaScript.
 * Utilise un fichier d'initialisation si le fichier principal est manquant ou vide.
 * * @param {string} mainFilePath - Chemin du fichier JSON principal (ex: expenses.json).
 * @returns {Promise<Object>} L'objet JavaScript parsé.
 */
async function parseJsonFile(mainFilePath) {
  let fileContent = "";

  try {
    // ⬇️ ESSAYER DE LIRE LE FICHIER PRINCIPAL ⬇️
    fileContent = await fsp.readFile(mainFilePath, { encoding: "utf8" });

    // Vérification : si le fichier principal est vide, on force l'utilisation du fichier d'initialisation.
    if (!fileContent.trim()) {
      console.warn(
        `Le fichier principal ${mainFilePath} est vide. Utilisation du fichier d'initialisation.`
      );
      throw new Error("Fichier vide"); // On lance une erreur pour passer au bloc catch
    }
  } catch (error) {
    // ⬇️ SI LA LECTURE ÉCHOUÉ (fichier introuvable ou vide) ⬇️

    // On affiche un message d'information
    console.warn(
      `Fichier ${mainFilePath} introuvable ou illisible. Chargement des données par défaut depuis ${EXPENSES_INIT_PATH}.`
    );

    try {
      // ESSAYER DE LIRE LE FICHIER D'INITIALISATION
      fileContent = await fsp.readFile(EXPENSES_INIT_PATH, { encoding: "utf8" });
    } catch (initError) {
      // SI MÊME LE FICHIER D'INITIALISATION ÉCHOUÉ
      console.error(
        `Erreur: Impossible de lire le fichier d'initialisation à ${EXPENSES_INIT_PATH}`
      );
      throw initError;
    }
  }

  // 3. Analyser le contenu (que ce soit le fichier principal ou le fichier d'initialisation)
  try {
    return JSON.parse(fileContent);
  } catch (parseError) {
    console.error(
      `Erreur lors de l'analyse du contenu JSON :`,
      parseError.message
    );
    throw new Error("Contenu JSON invalide.");
  }
}

// ===================================
// 2. Fonction pour SÉRIALISER (Objet JS -> Écrire JSON)
// ===================================

/**
 * Sérialise un objet JavaScript et l'écrit dans un fichier JSON.
 * @param {string} filePath - Chemin vers le fichier JSON de sortie.
 * @param {Object} data - L'objet JavaScript à sérialiser.
 * @returns {Promise<void>} Une promesse qui se résout une fois l'écriture terminée.
 */
async function serializeToJsonFile(filePath, data) {
  try {
    // 1. Sérialiser l'objet JS en une chaîne JSON.
    // L'argument 'null, 2' ajoute une indentation pour rendre le fichier lisible (format "pretty-print").
    const jsonContent = JSON.stringify(data, null, 2);

    // 2. Écrire la chaîne dans le fichier
    await fsp.writeFile(filePath, jsonContent, { encoding: "utf8" });

    console.log(`Données sérialisées écrites dans ${filePath}`);
  } catch (error) {
    console.error(
      `Erreur lors de la sérialisation et de l'écriture dans ${filePath}:`,
      error.message
    );
    throw new Error(`Échec de l'écriture du fichier JSON : ${filePath}`);
  }
}

function parseJsonFileSync(mainFilePath) {
  let fileContent = "";

  try {
    // Lire le fichier principal
    fileContent = fs.readFileSync(mainFilePath, { encoding: "utf8" });

    // Vérifier si le fichier est vide
    if (!fileContent.trim()) {
      console.warn(`Le fichier ${mainFilePath} est vide. Utilisation du fichier d'initialisation.`);
      throw new Error("Fichier vide");
    }
  } catch (error) {
    // Si le fichier principal est introuvable ou illisible
    console.warn(`Fichier ${mainFilePath} introuvable ou illisible. Chargement des données par défaut.`);
    try {
      // Lire le fichier d'initialisation
      fileContent = fs.readFileSync(EXPENSES_INIT_PATH, { encoding: "utf8" });
    } catch (initError) {
      // Si le fichier d'initialisation échoue
      console.error("Erreur lors de la lecture du fichier d'initialisation.");
      throw initError;
    }
  }

  // Analyser le contenu JSON
  try {
    return JSON.parse(fileContent);
  } catch (parseError) {
    console.error("Erreur lors de l'analyse du contenu JSON :", parseError.message);
    throw new Error("Contenu JSON invalide.");
  }
}

function serializeToJsonFileSync(filePath, data) {
  try {
    // Sérialiser l'objet JavaScript en chaîne JSON
    const jsonContent = JSON.stringify(data, null, 2);

    // Écrire la chaîne JSON dans le fichier
    fs.writeFileSync(filePath, jsonContent, { encoding: "utf8" });

    console.log(`Données sérialisées écrites dans ${filePath}`);
  } catch (error) {
    console.error(`Erreur lors de la sérialisation et de l'écriture dans ${filePath}:`, error.message);
    throw new Error(`Échec de l'écriture du fichier JSON : ${filePath}`);
  }
}

// Exporter les fonctions pour les rendre accessibles
module.exports = { parseJsonFile, serializeToJsonFile,parseJsonFileSync,serializeToJsonFileSync };
