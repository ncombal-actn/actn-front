import { Produit } from './produit';
import { Cotation } from './cotation';
import {Description} from "@/_util/models/Description";
/**
 * Modèle d'un item dans le panier.
 */
export class CartItem {
  /**
   * Le produit représenté par l'item.
   */
  produit: Produit;
  /**
   * La qte de ce produit dans le panier.
   */
  qte: number;
  /**
   * Cotation appliquée au produit dans le panier
   * Aucune cotation appliquée si vide ou null
   */
  cotation: Cotation;

  desc: Description;


  /**
   * Permet de récupérer un type CartItem depuis un objet non typé.
   * Utilisé pour reformer les items depuis les valeurs JSON enregistrées dans le localStorage.
   * @param obj L'objet non typé représentant l'item.
   */
 /*  static fromObject(obj: any): CartItem {
    const cartItem = new CartItem();

    for (const [property, value] of Object.entries(obj)) {
      cartItem[property] = value;
    }
    console.log('CartItem.fromObject - cartItem', cartItem);
    
    return cartItem;
  } */
/* static fromObject(obj: any): CartItem {
  const cartItem = new CartItem();

  const fieldsWithTransform: Record<string, (val: any) => any> = {
    produit: (val: any) => ({
      ...val,
      qtePrice: (val.qtePrice ?? []).map((qp: any) => ({ ...qp }))
    }),
    desc: (val: any) => ({ ...val }),
    cotation: (val: any) => ({ ...val })
  };

  for (const [key, val] of Object.entries(obj)) {
    if (fieldsWithTransform[key]) {
      cartItem[key] = fieldsWithTransform[key](val as any);
    } else {
      cartItem[key] = val;
    }
  }
console.log('CartItem.fromObject - cartItem', cartItem, fieldsWithTransform);

  return cartItem;
} */
static fromObject(obj: any): CartItem {
     const cartItem = new CartItem();

  cartItem.qte = obj.qte;
  cartItem.cotation = obj.cotation;
  cartItem.desc = obj.desc;
  cartItem.produit = Produit.fromObject(obj.produit);

  return cartItem;
}


toJSON() {
  return {
    ...this,
    produit: {
      ...this.produit,
      qtePrice: [...(this.produit.qtePrice ?? [])], // s'il y en a
    },
    desc: { ...this.desc },
    cotation: { ...this.cotation }
  };
}




  /**
   * Récupérer le nombre de produits actuellements en stock.
   */
  get partQteDisponible() {
    return this.produit.qteStock1;
  }

  /**
   * @returns Le coût H.T. total pour la qte souhaitée de ce produit.
   */
  get total() {
    // si une cotation est active
    if (this.cotation)
    {
      return (+this.cotation.prixvente * +this.qte);
    }
    else
    {
      // si un prix par quantité s'applique
      if (this.produit.hasPriceByQte)
      {
        let qpai: number = this.priceByQtyAppliedIndex;
        return (+this.produit.qtePrice[qpai].price * +this.qte);
      }
      else // total normal
      {
        return (+this.produit.prix * +this.qte);
      }
    }
  }

  /**
   * @returns L'index du tableau 'qtePrice' de ce produit, correspondant à la quantité du produit dans le panier
   */
  get priceByQtyAppliedIndex()
  {
    console.log('CartItem - priceByQtyAppliedIndex - produit', this.produit);
    
    if (this.produit.hasPriceByQte)
    {
      let qpai = 0;
      while ( ((qpai+1) < this.produit.qtePrice.length) && (+this.qte >= this.produit.qtePrice[qpai+1].qte) )
      {
        qpai++;
      }
      return (qpai);
    }
    return (0);
  }

  /**
   * @returns Le coût total de l'écopart pour la qte souhaitée de ce produit.
   */
  get totalEcoPart() {
    return +this.produit.prixD3E * +this.qte;
  }
}

