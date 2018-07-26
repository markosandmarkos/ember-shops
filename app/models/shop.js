import DS from 'ember-data';
import {computed} from '@ember/object';

export default DS.Model.extend({
  product: DS.hasMany('product'),
  name: DS.attr(),
  totalPrice: computed('product.@each.price', 'product.@each.quantity', function () {
    return this.get('product').reduce((firstValue, product) => (+firstValue + (+product.price * +product.quantity)), 0);
  })

});
