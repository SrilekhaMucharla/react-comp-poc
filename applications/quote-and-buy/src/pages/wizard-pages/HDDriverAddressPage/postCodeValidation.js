import { HastingsAddressLookupService } from 'hastings-capability-addresslookup';

const POSTCODE_REGEX = new RegExp('^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|'
+ '(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|'
+ '([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\\s?[0-9][A-Za-z]{2})$');

export default POSTCODE_REGEX;
