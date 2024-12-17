/**
 * @summary
 * Base class for building conditions for querying the database
 *
 * @example
 * // Must extend this class to define the allowed fields
 * class ProductFilterBuilder extends FilterBuilder {
 *    constructor(requestQuery) {
 *      super(requestQuery);
 *      this._allowFields = ["productId", "name", "price"];
 *   }
 * }
 *
 * // Usage
 * const conditions = new ProductFilterBuilder(req.query).build();
 * Product.findAll({ where: conditions });
 */
export class FilterBuilder {
    _allowFields = [];
    _comparisonOperators = {};
    _query = {};

    constructor(requestQuery) {
        this._query = requestQuery;
        this._allowFields = requestQuery ? Object.keys(requestQuery) : [];
        this._comparisonOperators = {
            "[lte]": Op.lte,
            "[gte]": Op.gte,
            "[between]": Op.between,
            "[like]": Op.like,
            "[ne]": Op.ne,
            "[lt]": Op.lt,
            "[gt]": Op.gt,
        };
    }

    /**
     * Convert Request.query to Sequelize-compatible condition object for querying the database
     *
     * @returns {Array} Array of conditions
     * Format: [{field1: [value1, value2]}, {field1: {operator1: value1}}, {field1: {operator2: value2}}, ...]
     */
    build = () => {
        if (!this._query) return [];

        const conditions = [];

        const fields = Object.keys(this._query).filter((field) =>
            this._allowFields.includes(field)
        );

        fields.forEach((field) => {
            if (!this._query[field]) return;

            let values = Array.isArray(this._query[field])
                ? [...this._query[field]]
                : [this._query[field]];

            const equalityValues = [];
            values.forEach((value) => {
                if (typeof value === "number") {
                    value = value.toString();
                }

                if (!value.includes("[")) {
                    equalityValues.push(value);
                    return;
                }

                Object.entries(this._comparisonOperators).forEach(
                    ([comparator, operator]) => {
                        if (!value.startsWith(comparator)) return;

                        let compareValue = value.substring(comparator.length);
                        if (operator === Op.between) {
                            compareValue = compareValue.split(",");
                        }

                        if (operator === Op.like) {
                            compareValue = `%${compareValue}%`;
                        }

                        conditions.push({
                            [field]: { [operator]: compareValue },
                        });
                    }
                );
            });

            if (equalityValues.length > 0) {
                conditions.push({ [field]: equalityValues });
            }
        });

        return conditions;
    };
}

/**
 * @example
 * const pagination = new PaginationBuilder(req.query).build();
 *
 * // Usage
 * Product.findAll({ limit: pagination.limit, offset: pagination.offset });
 */
export class PaginationBuilder {
    _query = {};
    constructor(requestQuery) {
        this._query = requestQuery;
    }

    /**
     * @summary Get the limit and offset values from the request query
     *
     * @returns {Object} An object contains the limit and offset values
     */
    build = () => {
        const DEFAULT_OFFSET = 0;
        const DEFAULT_SIZE = 5;

        if (!this._query)
            return { limit: DEFAULT_SIZE, offset: DEFAULT_OFFSET };
        const { page, size } = this._query;

        if (!page && !size)
            return { limit: DEFAULT_SIZE, offset: DEFAULT_OFFSET };

        if (!page) {
            return { limit: parseInt(size), offset: DEFAULT_OFFSET };
        }

        if (!size) {
            return {
                limit: DEFAULT_SIZE,
                offset: (parseInt(page) - 1) * DEFAULT_SIZE,
            };
        }

        return {
            limit: parseInt(size),
            offset: (parseInt(page) - 1) * parseInt(size),
        };
    };
}

/**
 * @summary
 * Base class to build sorting conditions for querying the database
 *
 * @example
 * class ProductSortBuilder extends SortBuilder {
 *   constructor(requestQuery) {
 *    super(requestQuery);
 *    this._map = {
 *      price: ["price"],
 *      name: ["name"],
 *    };
 *    this._defaultSort = [["name", "ASC"]];
 * }
 */
export class SortBuilder {
    _query = {};
    constructor(requestQuery) {
        this._query = requestQuery;
        this._map = {};
        this._defaultSort = [];
    }

    /**
     *
     * @summary Get sorting condtions from a request query to retrieve a sorted data
     * from a Sequelize magic method.
     *
     * @returns An array of order condtions which is compatible for Sequelize sorting.
     * Ex: [["price", "DESC"], ["name", "ASC"]]
     *
     */
    build = () => {
        const sortConditions = [];
        if (
            !this._query ||
            !this._query.sort ||
            !Array.isArray(this._query.sort)
        ) {
            return this._defaultSort;
        }
        let query = this._query.sort;

        query.forEach((sortString) => {
            if (sortString[0] === "-") {
                const field = sortString.substring(1);
                sortConditions.push([...this._mapping(field), "DESC"]);
                return;
            } else {
                const field = sortString;
                sortConditions.push([...this._mapping(field), "ASC"]);
            }
        });

        sortConditions.push(...this._defaultSort);

        return sortConditions;
    };

    /**
     * @summary Get the mapping of the field names in the request query to the field names in the database
     *
     * @protected
     * @param {string} name the name of the field in the request query
     * @returns {Object[]} the mapping of the field names in the request query to the field names in the database
     */
    _mapping(name) {
        return this._map[name] ? this._map[name] : [];
    }
}
