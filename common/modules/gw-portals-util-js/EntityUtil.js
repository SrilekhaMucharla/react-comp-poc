import _ from 'lodash';

let tmpId = 1;

/**
 * Finds a "primary key" property among different candidates.
 * @param {Object} item items defining exactly one "key property".
 * @param {Array} props possible property names.
 * @returns {String} name of the key property.
 * @throws Error if item have no key properties defined.
 * @throws Error if item have more than one key property.
 */
function findKeyProperty(item, props) {
    const keysOnItem = props.filter(item.hasOwnProperty.bind(item));
    if (keysOnItem.length <= 0) {
        throw new Error(`No key properties found on an item ${item}`);
    }

    if (keysOnItem.length > 1) {
        throw new Error(`Too many key properties are defined on an item, props=${keysOnItem.join(',')}, item=${item}`);
    }

    return keysOnItem[0];
}

/**
 * Utilities used to deal with entity model in portals.
 *
 * Entity is an object representing some domain object on the backend size. Thus
 * such entity usually have public ID or other way to uniquely distinguish from all
 * other entities. New entities could have tempId property which is used to reference
 * new items contained in collections or inside other objects.
 */
export default {
    /**
     * Attempts to find an entity matching an <code>item</code> in the list
     * of <code>items</code>. Supports both publicId and tempIds. Could automatically
     * create and add new items if appropriate options are provided.
     *
     * <h2>Examples</h2>
     * <pre>
     *     // Find vehicles using publicID and tempID
     *     EntityUtils.findMatchingEntity(vehicles, vehicle);
     *     // Find vehicles using privateID, transientID, externalID
     *     EntityUtils.findMatchingEntity(vehicles, vehicle,
     *     {keys : ['privateID', 'transientID', 'externalID']});
     *     // Find vehicles using publicID only
     *     EntityUtils.findMatchingEntity(vehicles, vehicle, {keys : ['publicID']});
     *
     *     // Find vehicles using publicID and tempID, create using ctor if not found
     *     EntityUtils.findMatchingEntity(vehicles, vehicle, {Ctor : Vehicle });
     *
     *     // Find vehicles using globalID only, create using ctor if not found
     *     EntityUtils.findMatchingEntity(vehicles, vehicle,
     *     {keys : ['globalID'], Ctor : Vehicle });
     * </pre>
     *
     * <h2>Options</h2>
     *
     * <dl>
     *     <dt>keys</dt>
     *     <dd>
     *         <p>Keys used to identify entities among other entities. Each entity must have
     *            exactly one of these properties defined. These are usually publicIds, tempIds, or
     *            items with similar meaning.
     *         </p>
     *         <p>
     *           This property should be an array of strings which names possible "primary keys" for
     *           entities in question.
     *         </p>
     *         <p>
     *             <strong>Default value</strong> ['publicID', 'tempID']
     *         </p>
     *     </dd>
     *
     *     <dt>ctor</dt>
     *     <dd>
     *         <p>Function used to create new items. If set (and not null) then this function
     *         will be called as a constructor and will get <code>item</code> as its only parameter.
     *         This function is called as <em>constructor</em> (i.e. <code>new ctor(item)</code>) so
     *         is is safe to use both constructor and regular mapping function as a parameter.
     *         </p>
     *         <p>New item is added into <code>items</code> array.</p>
     *         <p>
     *             <strong>Default value</strong> is not defined so this method will return
     *             <code>null</code> when no match was found.
     *         <p>
     *     </dd>
     * </dl>
     *
     * @param {Object} items items used to find an item.
     * @param {Object|undefined} item search "template" entity.
     *   This entity is used to build search criteria.
     *   Fields used depends on the <code>options</code> parameter.
     * @param {Object} [options] optional matching/search options. Default options are used if this
     *   object was not passed.
     * @returns {Object} One of the following values: <ul>
     *     <li> <code>null</code> if <code> item is null or not defined.
     *     <li>found item (element from <code>items</code>) if there is such an item.
     *     <li> <code>null</code> if item was not found and no constructor was defined.
     *     <li> Newly created item if options have a defined <code>ctor</code> function.
     *     That created item is added into the items list.
     * </ul>
     */
    findMatchingEntity: (items, item, options) => {
        if (!item) {
            return null;
        }

        // eslint-disable-next-line no-param-reassign
        options = options || {};

        const keyProp = findKeyProperty(item, options.keys || ['publicID', 'tempID']);
        const query = {};
        query[keyProp] = item[keyProp];

        const foundItem = _.find(items, query);
        if (foundItem) {
            return foundItem;
        }

        if (!options.Ctor) {
            return null;
        }

        const newItem = new options.Ctor(item);
        items.push(newItem);
        return newItem;
    },
    nextId() {
        tmpId += 1;
        return tmpId;
    }
};
