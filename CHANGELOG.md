### 0.1.8-sprt2 (2014-11-26)


#### Bug Fixes

* **cart:** Fixes toggle select all items. ([40c5b1d4](https://github.com/NCI-GDC/portal-ui/commit/40c5b1d426ea72104be988cce4ea15070c3ce1e1))


#### Features

* **404:** Adds 404 page for non existing pages. ([d1b4e6b0](https://github.com/NCI-GDC/portal-ui/commit/d1b4e6b01749287a9c56178b43011cde2395f7f8), closes [OICR-116](https://jira.opensciencedatacloud.org/browse/OICR-116))
* **a11y:** Adds ngAria module. ([df643057](https://github.com/NCI-GDC/portal-ui/commit/df643057ad27d1c5967436036c0f3ac1f8305b7b), closes [OICR-112](https://jira.opensciencedatacloud.org/browse/OICR-112))
* **api:** hooks up the UI to the API ([7e916401](https://github.com/NCI-GDC/portal-ui/commit/7e9164014f56abcc1c83426d417b8a4fe7b7f40b), closes [OICR-113](https://jira.opensciencedatacloud.org/browse/OICR-113))
* **app:**
  * better support for ajax spinners ([dadb14e3](https://github.com/NCI-GDC/portal-ui/commit/dadb14e336a44fc191fcbce9466d3a9431c7ffb1))
  * Display loading during AJAX requests. ([fcc0ee3d](https://github.com/NCI-GDC/portal-ui/commit/fcc0ee3d8fcf2f7bef42099fbeb8c81f6a4e5f0f), closes [OICR-117](https://jira.opensciencedatacloud.org/browse/OICR-117))
  * Adds NCI/NIH Header/Footer. ([4ef63aef](https://github.com/NCI-GDC/portal-ui/commit/4ef63aef37886348bd069249d29e92a2a2b5333c), closes [OICR-90](https://jira.opensciencedatacloud.org/browse/OICR-90))
* **core:** adds app loading screen ([229823d2](https://github.com/NCI-GDC/portal-ui/commit/229823d24eab79f69a9623f6ecd69120369af0cc), closes [OICR-118](https://jira.opensciencedatacloud.org/browse/OICR-118))
* **entities:** Adds sidebar navigation. ([824215f1](https://github.com/NCI-GDC/portal-ui/commit/824215f1cea95dcd2136687e18801ccf4dc56cb9), closes [OICR-110](https://jira.opensciencedatacloud.org/browse/OICR-110))
* **facets:**
  * updates facet styles/markup ([61346670](https://github.com/NCI-GDC/portal-ui/commit/613466704d6175c73881fcfed3434d6393928704))
  * updates facets to work with api ([4015b98c](https://github.com/NCI-GDC/portal-ui/commit/4015b98c0fea6b859d258a619d9a24d7d6747b4e))
* **location:** Adds Location Service. ([045dc4bf](https://github.com/NCI-GDC/portal-ui/commit/045dc4bf62e4fa1700718a71dbaa0d56e13ce580))
* **projects:**
  * better error handling ([c16b56f2](https://github.com/NCI-GDC/portal-ui/commit/c16b56f2f1c2c905f6808ddcb5f442cde69696f5))
  * updates facets ([2f710e72](https://github.com/NCI-GDC/portal-ui/commit/2f710e729f30191a8b82c7c5bb5b4fa9ebf23574))
* **reports:**
  * Create basic chart directive. ([21181e06](https://github.com/NCI-GDC/portal-ui/commit/21181e06a959d5e424da500f449409b6b0724209), closes [OICR-108](https://jira.opensciencedatacloud.org/browse/OICR-108))
  * Adds reports page. ([2501299a](https://github.com/NCI-GDC/portal-ui/commit/2501299a2861339604108d1f9bf580ba0028c28a))
* **search:** updates search facets ([1d2d8a2f](https://github.com/NCI-GDC/portal-ui/commit/1d2d8a2ff2e7be177cd847d3ee03e3709b5c92d5))


### 0.1.8-sprt1 (2014-11-07)


#### Features

* **cart:**
  * adds remove by id, select all ([f0917a98](https://github.com/NCI-GDC/portal-ui/commit/f0917a98a068e2e635af5bc776505fa32ad3449c))
  * Support localStorage of IDs ([b697d5c7](https://github.com/NCI-GDC/portal-ui/commit/b697d5c7f55745d3de7f4f83e58b6276a8d92ac5))
  * adds working methods to cart service ([39f63da0](https://github.com/NCI-GDC/portal-ui/commit/39f63da0969da07dafaa246d2827566e1084d5be), closes [OICR-58](https://jira.opensciencedatacloud.org/browse/OICR-58))
  * Updates to cart UI. ([58a7dfd6](https://github.com/NCI-GDC/portal-ui/commit/58a7dfd66476f4fbf9b917dc9ce366fef2256a3d), closes [OICR-52](https://jira.opensciencedatacloud.org/browse/OICR-52))
* **facets:**
  * simplify facets directive, ts fixes ([ba3d210c](https://github.com/NCI-GDC/portal-ui/commit/ba3d210c253cef2feb3124e6552808a3843bbc9b))
  * Updates facet UI. ([455b82d0](https://github.com/NCI-GDC/portal-ui/commit/455b82d076e88c1e841eae76662e5decf385d86b), closes [OICR-63](https://jira.opensciencedatacloud.org/browse/OICR-63))
* **header:** 
	* cart count in header tab ([1e43d4ce](https://github.com/NCI-GDC/portal-ui/commit/1e43d4ce4d9c39ef54eed6979ab0cc2d6db242d1), closes [OICR-59](https://jira.opensciencedatacloud.org/browse/OICR-59))
	* highlight active header link ([9f04fb5c](https://github.com/NCI-GDC/portal-ui/commit/9f04fb5cb97ab19cf34a67d445e594cc3869798f))
* **i18n:** Integrates i18n into application. ([e15366fa](https://github.com/NCI-GDC/portal-ui/commit/e15366faeeefe6da73f01478d6c2244591f621f0), closes [OICR-67](https://jira.opensciencedatacloud.org/browse/OICR-67))
* **search:** 
	* Files can be added to cart. ([7437d426](https://github.com/NCI-GDC/portal-ui/commit/7437d4263e2700b6d6a3802ee844f7d82fc8288d), closes [OICR-61](https://jira.opensciencedatacloud.org/browse/OICR-61))
	* updates search tables ([3aaf0b36](https://github.com/NCI-GDC/portal-ui/commit/3aaf0b367c83f0985bd206323d920a488866088a), closes [OICR-27](https://jira.opensciencedatacloud.org/browse/OICR-27))
* **annotations:** Updates UI to new mockups. ([4e0347cd](https://github.com/NCI-GDC/portal-ui/commit/4e0347cda1750381024032e95cf32e037be96f06), closes [OICR-47](https://jira.opensciencedatacloud.org/browse/OICR-47))
* **core:** adds service for page state ([b703dc87](https://github.com/NCI-GDC/portal-ui/commit/b703dc87c731f4fccd9dbea4be27be01a4857e10), closes [OICR-57](https://jira.opensciencedatacloud.org/browse/OICR-57))
* **files:** Updates File Entity UI. ([82798c6b](https://github.com/NCI-GDC/portal-ui/commit/82798c6bfd37d714d1c075ae846f9c3b47e87750), closes [OICR-37](https://jira.opensciencedatacloud.org/browse/OICR-37))
* **participant:** Updates UI to new mockups. ([745e523c](https://github.com/NCI-GDC/portal-ui/commit/745e523c9e408488d50c7d1772b2c7922cae2674), closes [OICR-52](https://jira.opensciencedatacloud.org/browse/OICR-52))
* **project:** update to match new mockups ([65b4ae57](https://github.com/NCI-GDC/portal-ui/commit/65b4ae57220fe58ede624f0f25746994e98bf4c6), closes [OICR-25](https://jira.opensciencedatacloud.org/browse/OICR-25))
* **projects:** update projects list ([83a32db1](https://github.com/NCI-GDC/portal-ui/commit/83a32db121e828d228686a5e2aba1672b016e83e), closes [OICR-22](https://jira.opensciencedatacloud.org/browse/OICR-22))


### 0.1.5 (2014-10-22)


#### Bug Fixes

* **dependencies:** fixes typescript/ng issues. ([b9482767](https://github.com/NCI-GDC/portal-ui/commit/b9482767d0cb5655f1aef79a599e27a355c20f96), closes [GDC-60](https://jira.oicr.on.ca/browse/GDC-60))


#### Features

* **annotations:** Add pages for annotations ([c765cb56](https://github.com/NCI-GDC/portal-ui/commit/c765cb5652b88e9969c363847040fced4f17b903), closes [GDC-44](https://jira.oicr.on.ca/browse/GDC-44))
* **cart:** adds cart ([c7ec393e](https://github.com/NCI-GDC/portal-ui/commit/c7ec393e7cf33c5c72c8514935862df8b8384944), closes [GDC-61](https://jira.oicr.on.ca/browse/GDC-61))
* **files:** Add basic entity page for Files. ([a8ff4fb2](https://github.com/NCI-GDC/portal-ui/commit/a8ff4fb24ad435bea68f232f6261b242dbc4a900), closes [GDC-43](https://jira.oicr.on.ca/browse/GDC-43))
* **participants:** Initial work for participants. ([f5ac3cab](https://github.com/NCI-GDC/portal-ui/commit/f5ac3cabbec757f5139b17e6d61e0a4e9b73b5f7), closes [GDC-42](https://jira.oicr.on.ca/browse/GDC-42))
* **projects:** project and projects list pages ([0c1a16ea](https://github.com/NCI-GDC/portal-ui/commit/0c1a16eada9ecee15742de1b315fc5a3fe77e9d5), closes [GDC-45](https://jira.oicr.on.ca/browse/GDC-45))
* **release:** adds build scripts ([b55a7c05](https://github.com/NCI-GDC/portal-ui/commit/b55a7c053042a00777ae04b4e2590f0405b66e2a), closes [GDC-9](https://jira.oicr.on.ca/browse/GDC-9))
* **search:**
  * Adds entry count dropdown. ([f926b123](https://github.com/NCI-GDC/portal-ui/commit/f926b12339c79b3eed81ea00cfd62cbf129375a8), closes [GDC-55](https://jira.oicr.on.ca/browse/GDC-55))
  * Adds pagination controls. ([068b5467](https://github.com/NCI-GDC/portal-ui/commit/068b5467ce2ff25ba84a8213b9281e89979aa984))
  * Facets trigger updates to table data ([8438606e](https://github.com/NCI-GDC/portal-ui/commit/8438606eff43315a8f2461d609e19d3b2746fed6))
  * Adds basic search skeleton. ([23c7d4d4](https://github.com/NCI-GDC/portal-ui/commit/23c7d4d4615f249e689d92ecb903e933a3c19f07))


