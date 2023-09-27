type InventoryItem = {
    name: string,
    imgUrl: string | null,
    description: string,
    price: number,
}

type InventoryItemName = 'Sauce Labs Backpack' | 'Sauce Labs Bike Light' | 'Sauce Labs Bolt T-Shirt'
    | 'Sauce Labs Fleece Jacket' | 'Sauce Labs Onesie';

export { InventoryItem, InventoryItemName };