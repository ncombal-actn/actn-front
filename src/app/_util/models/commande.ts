/**
 * Modèle d'une commande.
 */
export class Commande {
  /** ID / Numéro de commande */
  numcommande: string;
  /** Numéro de la facture de la commande */
  numfacture: string;
  /** Numéro du Bon de Livraison de la commande */
  numbl: string;
  /** Numéro du Bon de Préparation de la commande */
  numbp: string;
  /** Nom / Référence de la commande */
  referencecommande: string;
  /** Status de la commande */
  statut: string;
  /** Date à laquelle la commande à été validée */
  datecommande: Date;
  /** Date à de création de la facture */
  datefacture: Date;
  /** Date de création du bon de livraison */
  datebl: Date;
}
