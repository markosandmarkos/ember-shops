import Controller from '@ember/controller';

export default Controller.extend({

  id: '',
  name: '',
  quantity: '',
  price: '',
  actionsModalTitle: '',

  actions: {

    openActionsModal(actionType, modalTitle, product) {

      const newProductData = {
        actionsModalTitle: modalTitle,
        actionType: actionType,
        isDelete: false,
        actionsModal: true,
        isNotValid: false
      };

      switch (actionType) {
        case 'create':
          this.emptyModal();
          break;
        case 'update' :
          newProductData.id = product.id;
          newProductData.name = product.name;
          newProductData.quantity = product.quantity;
          newProductData.price = product.price;

          break;
        case 'delete':
          newProductData.id = product.id;
          newProductData.isDelete = true;
          break;
      }

      this.setProperties(newProductData);

    },

    submit(type) {

      switch (type) {
        case 'create' :
          if (!this.checkValidation()) return;
          this.create();
          break;
        case 'update' :
          if (!this.checkValidation()) return;
          this.update();
          break;
        case 'delete':
          this.delete();
          break;
      }

      this.emptyModal();
      this.set('actionsModal', false);

    },

  },

  async create() {

    const shop = this.get('store').peekRecord('shop', this.get('model.id'));

    const product = await this.get('store').createRecord('product', {
      name: this.get('name'),
      quantity: this.get('quantity'),
      price: this.get('price'),
      shop: shop
    });

    await product.save();
    await shop.save();

  },

  async update() {

    const shop = this.get('store').peekRecord('shop', this.get('model.id'));

    const product = this.get('store').peekRecord('product', this.get('id'));
    product.set('name', this.get('name'));
    product.set('quantity', this.get('quantity'));
    product.set('price', this.get('price'));

    shop.get('product').pushObject(product);

    await shop.save();

  },

  async delete() {

    const product = this.get('store').peekRecord('product', this.get('id'));
    product.set('shop', null);
    await product.save();

  },

  emptyModal() {

    this.setProperties({
      id: '',
      name: '',
      actionsModalTitle: '',
      quantity: '',
      price: ''
    });

  },

  checkValidation() {

    this.set(
      'isNotValid',
      (this.get('name') === '' || this.get('quantity') === '' || this.get('price') === '')
    );

    return !this.get('isNotValid')
  }

});
