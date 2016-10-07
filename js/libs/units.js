// -------------------------------------------------------------
// Definitions of various units (i.e data types) for metrics.
// -------------------------------------------------------------

import _ from 'lodash'

const units = [
    {
        key: 'degreesCelcius',
        label: 'Degrees Celcius',
        shortLabel: '°C',
        color: '#FC9D9A',
        formatter: v => parseFloat(v).toFixed(1)
    },
    {
        key: 'percent',
        label: 'Percent',
        shortLabel: '%',
        color: '#C8C8A9',
        formatter: v => v
    },
    {
        key: 'lumens',
        label: 'Lumens',
        shortLabel: ' lumens',
        color: '#83AF9B',
        formatter: v => v
    },
    {
        key: 'rpm',
        label: 'RPM',
        shortLabel: ' rpm',
        color: '#C44D58',
        formatter: v => v
    }
]

export default {
    units: units,
    getUnitsWithKey: (key) => {
        return _.find(units, (unit) => {
            return unit.key === key;
        });
    }
}
