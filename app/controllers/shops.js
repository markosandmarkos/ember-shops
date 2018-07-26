import Controller from '@ember/controller';

export default Controller.extend({

  id: '',
  name: '',
  actionsModalTitle: '',

  actions: {

    openActionsModal(actionType, modalTitle, shop) {

      const newShopData = {
        actionsModalTitle: modalTitle,
        actionsModal: true,
        actionType: actionType,
        isDelete: false,
        isNotValid: false
      };

      switch (actionType) {
        case 'create':
          this.emptyModal();
          break;
        case 'update' :
          newShopData.id = shop.id;
          newShopData.name = shop.name;

          break;
        case 'delete':
          newShopData.id = shop.id;
          newShopData.isDelete = true;

          break;
      }

      this.setProperties(newShopData);

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

    const newShopName = this.get('name');

    let shop = await this.get('store').createRecord('shop', {
      name: newShopName
    });

    shop.save();

  },

  async update() {

    const id = this.get('id');
    const shopName = this.get('name');

    const shop = await this.get('store').findRecord('shop', id);
    shop.set('name', shopName);
    shop.save();

  },

  async delete() {

    const id = this.get('id');

    const shop = await this.get('store').findRecord('shop', id, {reload: true});
    shop.destroyRecord();
  },

  emptyModal() {
    this.setProperties({
      id: '',
      name: '',
      actionsModalTitle: '',
    });
  },

  checkValidation() {
    this.set('isNotValid', this.get('name') === '');
    return !this.get('isNotValid')
  }


});
