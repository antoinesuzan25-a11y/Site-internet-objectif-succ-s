// ===== RÉGLAGES DU SITE — seul fichier à modifier pour ouvrir la vente =====
window.SITE = {
  // false = vitrine uniquement (boutons « Bientôt disponible »). Passe à true seulement quand un vendeur majeur
  // (statut + compte Stripe à son nom) est en place.
  SALES_OPEN: false, // ne concerne que les fiches du bac ; le carnet Parcoursup a son propre lien dans index.html
  // Lien d'un formulaire d'inscription (Tally, Google Forms…) pour prévenir les lycéens à l'ouverture. Laisse vide pour le masquer.
  WAITLIST_URL: "",
  PRICE: 2,
  // Chaque fiche : colle son lien Stripe (Payment Link) dans « stripe ».
  // Le PDF correspondant est dans fiches/ sous le nom « id.pdf » (ex. fiches/maths-t.pdf).
  // Après-paiement Stripe d'une fiche : https://TON-SITE/merci-bac.html?m=ID   (ex. merci-bac.html?m=maths-t)
  SUBJECTS: [
    {
      "id": "francais-p",
      "name": "Français (écrit)",
      "group": "Tronc commun",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "philo-t",
      "name": "Philosophie",
      "group": "Tronc commun",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "histgeo-p",
      "name": "Histoire-géographie",
      "group": "Tronc commun",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "histgeo-t",
      "name": "Histoire-géographie",
      "group": "Tronc commun",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "enseigsci-p",
      "name": "Enseignement scientifique",
      "group": "Tronc commun",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "enseigsci-t",
      "name": "Enseignement scientifique",
      "group": "Tronc commun",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "anglais-p",
      "name": "Anglais (LVA)",
      "group": "Tronc commun",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "anglais-t",
      "name": "Anglais (LVA)",
      "group": "Tronc commun",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "maths-p",
      "name": "Mathématiques",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "maths-t",
      "name": "Mathématiques",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "physchimie-p",
      "name": "Physique-chimie",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "physchimie-t",
      "name": "Physique-chimie",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "svt-p",
      "name": "SVT",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "svt-t",
      "name": "SVT",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "nsi-p",
      "name": "NSI (informatique)",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "nsi-t",
      "name": "NSI (informatique)",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "ses-p",
      "name": "SES (sciences économiques et sociales)",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "ses-t",
      "name": "SES (sciences économiques et sociales)",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "hggsp-p",
      "name": "HGGSP",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "hggsp-t",
      "name": "HGGSP",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "hlp-p",
      "name": "HLP (humanités, littérature et philosophie)",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "hlp-t",
      "name": "HLP (humanités, littérature et philosophie)",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "llcer-p",
      "name": "LLCER Anglais",
      "group": "Spécialités",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "llcer-t",
      "name": "LLCER Anglais",
      "group": "Spécialités",
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "oralfrancais-p",
      "name": "Oral de français",
      "group": "Épreuves orales",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "maths-anticipe-p",
      "name": "Bac anticipé de maths",
      "group": "Épreuves anticipées",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "astuces-oral-francais-p",
      "name": "Astuces oral de français",
      "group": "Épreuves orales",
      "level": "Première",
      "stripe": ""
    },
    {
      "id": "grandoral-t",
      "name": "Grand oral",
      "group": "Épreuves orales",
      "level": "Terminale",
      "stripe": ""
    }
  ],
  // Packs à prix réduit : le client choisit ses spécialités sur la page de remerciement.
  // Après-paiement Stripe d'un pack : https://TON-SITE/merci-bac.html?m=ID   (ex. merci-bac.html?m=pack-terminale)
  PACKS: [
    {
      "id": "pack-terminale",
      "name": "Pack Terminale",
      "desc": "Philosophie + 2 spécialités de ton choix",
      "price": 5,
      "fixed": [
        "philo-t"
      ],
      "pick": 2,
      "level": "Terminale",
      "stripe": ""
    },
    {
      "id": "pack-premiere",
      "name": "Pack Première",
      "desc": "Français + 2 spécialités de ton choix",
      "price": 5,
      "fixed": [
        "francais-p"
      ],
      "pick": 2,
      "level": "Première",
      "stripe": ""
    }
  ]
};
