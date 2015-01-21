### 0.1.8 (2015-01-21)


#### Bug Fixes

* **cart:** Fixes toggle select all items. ([40c5b1d4](https://github.com/NCI-GDC/portal-ui/commit/40c5b1d426ea72104be988cce4ea15070c3ce1e1))
* **facets:**
  * display _missing terms ([989a8b58](https://github.com/NCI-GDC/portal-ui/commit/989a8b584cc2c14ba7e20e24ecc1e819095653f3), closes [OICR-172](https://jira.opensciencedatacloud.org/browse/OICR-172))
  * use indexOf ([329016fe](https://github.com/NCI-GDC/portal-ui/commit/329016fe45cd9770c48b53b7e02a902dda013b8c))
  * don't allow dup terms to be added ([da56974d](https://github.com/NCI-GDC/portal-ui/commit/da56974d9cbed3f1a9ea103dff0765fa112d2491))
* **tablecious:** restore add all in search result ([a571e556](https://github.com/NCI-GDC/portal-ui/commit/a571e556dccf70cbcee53b59a181af5450203960))
* **tables:** updates to table headers ([23f98873](https://github.com/NCI-GDC/portal-ui/commit/23f98873d1dcaecfded5ff877844637d5166ba06))


#### Features

* **404:** Adds 404 page for non existing pages. ([d1b4e6b0](https://github.com/NCI-GDC/portal-ui/commit/d1b4e6b01749287a9c56178b43011cde2395f7f8), closes [OICR-116](https://jira.opensciencedatacloud.org/browse/OICR-116))
* **a11y:**
  * Continued improvement w/ 508 comp. ([a6efdd2c](https://github.com/NCI-GDC/portal-ui/commit/a6efdd2c765f52b6bc63369a1a6823d014c27acc), closes [OICR-158](https://jira.opensciencedatacloud.org/browse/OICR-158))
  * Adds ngAria module. ([df643057](https://github.com/NCI-GDC/portal-ui/commit/df643057ad27d1c5967436036c0f3ac1f8305b7b), closes [OICR-112](https://jira.opensciencedatacloud.org/browse/OICR-112))
* **annotations:**
  * hook up id search ([b14c2303](https://github.com/NCI-GDC/portal-ui/commit/b14c23039c8f495b3789d340d5eaac2c3d33fb10))
  * Updates UI to new mockups. ([4e0347cd](https://github.com/NCI-GDC/portal-ui/commit/4e0347cda1750381024032e95cf32e037be96f06), closes [OICR-47](https://jira.opensciencedatacloud.org/browse/OICR-47))
* **api:** hooks up the UI to the API ([7e916401](https://github.com/NCI-GDC/portal-ui/commit/7e9164014f56abcc1c83426d417b8a4fe7b7f40b), closes [OICR-113](https://jira.opensciencedatacloud.org/browse/OICR-113))
* **app:**
  * undo add/remove files in notification ([2b24a742](https://github.com/NCI-GDC/portal-ui/commit/2b24a7420bafc5c3b3dad1b9607e250ccc3af222), closes [OICR-169](https://jira.opensciencedatacloud.org/browse/OICR-169))
  * Create table sorting directive ([420e25f1](https://github.com/NCI-GDC/portal-ui/commit/420e25f117a4f5c8cf05bc0d58fd8e37d70931fc), closes [OICR-195](https://jira.opensciencedatacloud.org/browse/OICR-195))
  * Loading spinner on page XHR requests ([b4e08621](https://github.com/NCI-GDC/portal-ui/commit/b4e08621d84d03b479113abd3f1d72a1f9e8f198))
  * link download btns w/ makeDownloadLink ([61c9126b](https://github.com/NCI-GDC/portal-ui/commit/61c9126bda323407084f6b4769b0febcae3cd17b), closes [OICR-165](https://jira.opensciencedatacloud.org/browse/OICR-165))
  * adds undo to cart notification ([01bf7cc5](https://github.com/NCI-GDC/portal-ui/commit/01bf7cc5453b1813fcc12cdb928ddab7252384d2), closes [OICR-169](https://jira.opensciencedatacloud.org/browse/OICR-169))
  * notify when file added to cart ([5f0395e0](https://github.com/NCI-GDC/portal-ui/commit/5f0395e0dd8bb94f068597b7e7f8d834b1699767), closes [OICR-168](https://jira.opensciencedatacloud.org/browse/OICR-168))
  * Create reusable pagination controls. ([2390115a](https://github.com/NCI-GDC/portal-ui/commit/2390115a79c85a0c92a96c9783ba87ee8f4b39b6), closes [OICR-159](https://jira.opensciencedatacloud.org/browse/OICR-159))
  * some fixes to table contents ([35e653ac](https://github.com/NCI-GDC/portal-ui/commit/35e653ac9b14bfb32c94d63bae7c7da831762659), closes [OICR-160](https://jira.opensciencedatacloud.org/browse/OICR-160))
  * Adds progress bar indicator. ([f64b4ce1](https://github.com/NCI-GDC/portal-ui/commit/f64b4ce1b28581e5c2760f8e03a9f03bb1d04476), closes [OICR-126](https://jira.opensciencedatacloud.org/browse/OICR-126))
  * check content of modules ([735b2271](https://github.com/NCI-GDC/portal-ui/commit/735b2271963c6b40415895d133c2b2bd9f3c5320), closes [OICR-131](https://jira.opensciencedatacloud.org/browse/OICR-131))
  * Generate front end config file. ([8e97245a](https://github.com/NCI-GDC/portal-ui/commit/8e97245a5f3443a9d0e248beff765ab866bdae7e), closes [OICR-125](https://jira.opensciencedatacloud.org/browse/OICR-125))
  * better support for ajax spinners ([dadb14e3](https://github.com/NCI-GDC/portal-ui/commit/dadb14e336a44fc191fcbce9466d3a9431c7ffb1))
  * Display loading during AJAX requests. ([fcc0ee3d](https://github.com/NCI-GDC/portal-ui/commit/fcc0ee3d8fcf2f7bef42099fbeb8c81f6a4e5f0f), closes [OICR-117](https://jira.opensciencedatacloud.org/browse/OICR-117))
  * Adds NCI/NIH Header/Footer. ([4ef63aef](https://github.com/NCI-GDC/portal-ui/commit/4ef63aef37886348bd069249d29e92a2a2b5333c), closes [OICR-90](https://jira.opensciencedatacloud.org/browse/OICR-90))
* **build:** Production environment build step. ([b2a63e02](https://github.com/NCI-GDC/portal-ui/commit/b2a63e02e437cc3e39b8adb97494fe9a0d9bda8b), closes [OICR-146](https://jira.opensciencedatacloud.org/browse/OICR-146))
* **cart:**
  * Add bar charts to cart. ([86d20b41](https://github.com/NCI-GDC/portal-ui/commit/86d20b416bbcb2b03a8a03b9a13248d2c5f17b75), closes [OICR-217](https://jira.opensciencedatacloud.org/browse/OICR-217))
  * Add pagination to cart page. ([d568ad2d](https://github.com/NCI-GDC/portal-ui/commit/d568ad2def3fa08c4431c7aa24112e89a97bd845), closes [OICR-194](https://jira.opensciencedatacloud.org/browse/OICR-194))
  * update cart buttons/actions ([5c48317c](https://github.com/NCI-GDC/portal-ui/commit/5c48317c1347b0ab772d0c793900cf7fc9f7d285), closes [OICR-137](https://jira.opensciencedatacloud.org/browse/OICR-137))
  * adds remove by id, select all ([f0917a98](https://github.com/NCI-GDC/portal-ui/commit/f0917a98a068e2e635af5bc776505fa32ad3449c))
  * Support localStorage of IDs ([b697d5c7](https://github.com/NCI-GDC/portal-ui/commit/b697d5c7f55745d3de7f4f83e58b6276a8d92ac5))
  * adds working methods to cart service ([39f63da0](https://github.com/NCI-GDC/portal-ui/commit/39f63da0969da07dafaa246d2827566e1084d5be), closes [OICR-58](https://jira.opensciencedatacloud.org/browse/OICR-58))
  * Updates to cart UI. ([58a7dfd6](https://github.com/NCI-GDC/portal-ui/commit/58a7dfd66476f4fbf9b917dc9ce366fef2256a3d), closes [OICR-52](https://jira.opensciencedatacloud.org/browse/OICR-52))
* **core:**
  * send js errors to API ([fd789b0c](https://github.com/NCI-GDC/portal-ui/commit/fd789b0c9b22c12a18f54509d0a97cce78d299f5), closes [OICR-212](https://jira.opensciencedatacloud.org/browse/OICR-212))
  * adds app loading screen ([229823d2](https://github.com/NCI-GDC/portal-ui/commit/229823d24eab79f69a9623f6ecd69120369af0cc), closes [OICR-118](https://jira.opensciencedatacloud.org/browse/OICR-118))
  * adds service for page state ([b703dc87](https://github.com/NCI-GDC/portal-ui/commit/b703dc87c731f4fccd9dbea4be27be01a4857e10), closes [OICR-57](https://jira.opensciencedatacloud.org/browse/OICR-57))
* **current:** allows multi terms ([1d293a2c](https://github.com/NCI-GDC/portal-ui/commit/1d293a2c25527736598bd027932480539e6c1dfe))
* **entities:** Adds sidebar navigation. ([824215f1](https://github.com/NCI-GDC/portal-ui/commit/824215f1cea95dcd2136687e18801ccf4dc56cb9), closes [OICR-110](https://jira.opensciencedatacloud.org/browse/OICR-110))
* **facets:**
  * add id autosuggest support. ([50c5ab2a](https://github.com/NCI-GDC/portal-ui/commit/50c5ab2aacf890cd8759550180b145a5dc982254), closes [OICR-173](https://jira.opensciencedatacloud.org/browse/OICR-173))
  * hooks up id facet with LocationService ([c87aa5b0](https://github.com/NCI-GDC/portal-ui/commit/c87aa5b02579e3513029690ded24fa39e9ff947b), closes [OICR-143](https://jira.opensciencedatacloud.org/browse/OICR-143))
  * updates facet styles/markup ([61346670](https://github.com/NCI-GDC/portal-ui/commit/613466704d6175c73881fcfed3434d6393928704))
  * updates facets to work with api ([4015b98c](https://github.com/NCI-GDC/portal-ui/commit/4015b98c0fea6b859d258a619d9a24d7d6747b4e))
  * simplify facets directive, ts fixes ([ba3d210c](https://github.com/NCI-GDC/portal-ui/commit/ba3d210c253cef2feb3124e6552808a3843bbc9b))
  * Updates facet UI. ([455b82d0](https://github.com/NCI-GDC/portal-ui/commit/455b82d076e88c1e841eae76662e5decf385d86b), closes [OICR-63](https://jira.opensciencedatacloud.org/browse/OICR-63))
* **files:**
  * add back remove frm cart & archive cell ([67cc52e3](https://github.com/NCI-GDC/portal-ui/commit/67cc52e3c324cf5dbbc48948d8aa8ce920537be7), closes [OICR-162](https://jira.opensciencedatacloud.org/browse/OICR-162))
  * field/facet updates ([89ad7e0a](https://github.com/NCI-GDC/portal-ui/commit/89ad7e0a6f58c35bcab86bf6798364d7e92ceb1f))
  * Adds file size filter. ([fd944876](https://github.com/NCI-GDC/portal-ui/commit/fd9448769ff85db02e27ff2563a754baaff42629), closes [OICR-82](https://jira.opensciencedatacloud.org/browse/OICR-82))
  * Updates File Entity UI. ([82798c6b](https://github.com/NCI-GDC/portal-ui/commit/82798c6bfd37d714d1c075ae846f9c3b47e87750), closes [OICR-37](https://jira.opensciencedatacloud.org/browse/OICR-37))
* **filter:** add humanify filter ([c47fa078](https://github.com/NCI-GDC/portal-ui/commit/c47fa078a11b4ed180ee8acc1a67ec4b31b47221), closes [OICR-166](https://jira.opensciencedatacloud.org/browse/OICR-166))
* **gql:** adds gql directive ([05583eac](https://github.com/NCI-GDC/portal-ui/commit/05583eac9c05a7ecf549df3859c0a3157c9d94fa))
* **header:**
  * cart count in header tab ([1e43d4ce](https://github.com/NCI-GDC/portal-ui/commit/1e43d4ce4d9c39ef54eed6979ab0cc2d6db242d1), closes [OICR-59](https://jira.opensciencedatacloud.org/browse/OICR-59))
  * highlight active header link ([9f04fb5c](https://github.com/NCI-GDC/portal-ui/commit/9f04fb5cb97ab19cf34a67d445e594cc3869798f))
* **i18n:** Integrates i18n into application. ([e15366fa](https://github.com/NCI-GDC/portal-ui/commit/e15366faeeefe6da73f01478d6c2244591f621f0), closes [OICR-67](https://jira.opensciencedatacloud.org/browse/OICR-67))
* **location:** Adds Location Service. ([045dc4bf](https://github.com/NCI-GDC/portal-ui/commit/045dc4bf62e4fa1700718a71dbaa0d56e13ce580))
* **login:** Mockup login process. ([51b052f1](https://github.com/NCI-GDC/portal-ui/commit/51b052f13676fae14b90bbac3907e20345a07271), closes [OICR-167](https://jira.opensciencedatacloud.org/browse/OICR-167))
* **models:** field updates ([219996cb](https://github.com/NCI-GDC/portal-ui/commit/219996cb210015063fb000c0cb3e44c9656441ae))
* **participant:** Updates UI to new mockups. ([745e523c](https://github.com/NCI-GDC/portal-ui/commit/745e523c9e408488d50c7d1772b2c7922cae2674), closes [OICR-52](https://jira.opensciencedatacloud.org/browse/OICR-52))
* **participants:** Initial Biospecimen section. ([e8579df0](https://github.com/NCI-GDC/portal-ui/commit/e8579df0b8a0640eba837e948f2989fb7acb87be), closes [OICR-209](https://jira.opensciencedatacloud.org/browse/OICR-209))
* **project:**
  * updates to work with new data model ([afb12377](https://github.com/NCI-GDC/portal-ui/commit/afb123776a409c879084986d0f9e6868bd2ff6f9))
  * update to match new mockups ([65b4ae57](https://github.com/NCI-GDC/portal-ui/commit/65b4ae57220fe58ede624f0f25746994e98bf4c6), closes [OICR-25](https://jira.opensciencedatacloud.org/browse/OICR-25))
* **projects:**
  * updates project search links ([7c6cb981](https://github.com/NCI-GDC/portal-ui/commit/7c6cb981ffb9851db7a5da141646544264b9c347))
  * hook up project code search ([6804785c](https://github.com/NCI-GDC/portal-ui/commit/6804785cc60feb731fe786efeeb1afd17e2c43f1))
  * better error handling ([c16b56f2](https://github.com/NCI-GDC/portal-ui/commit/c16b56f2f1c2c905f6808ddcb5f442cde69696f5))
  * updates facets ([2f710e72](https://github.com/NCI-GDC/portal-ui/commit/2f710e729f30191a8b82c7c5bb5b4fa9ebf23574))
  * update projects list ([83a32db1](https://github.com/NCI-GDC/portal-ui/commit/83a32db121e828d228686a5e2aba1672b016e83e), closes [OICR-22](https://jira.opensciencedatacloud.org/browse/OICR-22))
* **reports:**
  * basic pie-chart directive ([1dd05975](https://github.com/NCI-GDC/portal-ui/commit/1dd0597561b34229d6ec5336529dfb2c072c2d0a), closes [OICR-109](https://jira.opensciencedatacloud.org/browse/OICR-109))
  * Create basic chart directive. ([21181e06](https://github.com/NCI-GDC/portal-ui/commit/21181e06a959d5e424da500f449409b6b0724209), closes [OICR-108](https://jira.opensciencedatacloud.org/browse/OICR-108))
  * Adds reports page. ([2501299a](https://github.com/NCI-GDC/portal-ui/commit/2501299a2861339604108d1f9bf580ba0028c28a))
* **search:**
  * Re-enable removing files. ([252eb7bf](https://github.com/NCI-GDC/portal-ui/commit/252eb7bf9aad1207acc66a4b783a898fb1821ff9), closes [OICR-218](https://jira.opensciencedatacloud.org/browse/OICR-218))
  * add to cart in summary tab ([06323bcc](https://github.com/NCI-GDC/portal-ui/commit/06323bcc2beb5aa173177251fde9c2e8e04ecf85))
  * adds summary tab ([dfb85ec5](https://github.com/NCI-GDC/portal-ui/commit/dfb85ec50559e91eee3cb040b0c5f190a1664525))
  * adds support for new index ([d138c324](https://github.com/NCI-GDC/portal-ui/commit/d138c324f931cbb9448f9ab46b495e44a8dfd374))
  * search table header actions ([f929b2a2](https://github.com/NCI-GDC/portal-ui/commit/f929b2a26f44ce8b701895ee618b842ce367f1f7), closes [OICR-193](https://jira.opensciencedatacloud.org/browse/OICR-193))
  * Switch back to Tabs for facets. ([175c971d](https://github.com/NCI-GDC/portal-ui/commit/175c971d2ec2c88920ff99a9a8a53e2b511ce8a1), closes [OICR-208](https://jira.opensciencedatacloud.org/browse/OICR-208))
  * add tumor tissue status ([7db74e40](https://github.com/NCI-GDC/portal-ui/commit/7db74e40b63ca01a47d3053b29dd6a273712a028), closes [OICR-187](https://jira.opensciencedatacloud.org/browse/OICR-187))
  * add dropdwn archive & metafiles link ([9320130f](https://github.com/NCI-GDC/portal-ui/commit/9320130f58594a0447f21070e39cc2608abc1099), closes [OICR-161](https://jira.opensciencedatacloud.org/browse/OICR-161))
  * Participant buttons add files. ([b25ba9b3](https://github.com/NCI-GDC/portal-ui/commit/b25ba9b39e79f6e8026f9f8198dbfda4a8e0595a), closes [OICR-164](https://jira.opensciencedatacloud.org/browse/OICR-164))
  * support xfilter on facets ([59d1222e](https://github.com/NCI-GDC/portal-ui/commit/59d1222eb9d3c79e04da8ac2ada83b5dd042579d), closes [OICR-133](https://jira.opensciencedatacloud.org/browse/OICR-133))
  * Add advanced query toggle. ([1aac50bb](https://github.com/NCI-GDC/portal-ui/commit/1aac50bb14e5160158be2414fcae4dd5079b34d5), closes [OICR-95](https://jira.opensciencedatacloud.org/browse/OICR-95))
  * Update Annotations Page ([8659e86b](https://github.com/NCI-GDC/portal-ui/commit/8659e86bb922969cefe9408a718702458d473d7c), closes [OICR-130](https://jira.opensciencedatacloud.org/browse/OICR-130))
  * updates search facets ([1d2d8a2f](https://github.com/NCI-GDC/portal-ui/commit/1d2d8a2ff2e7be177cd847d3ee03e3709b5c92d5))
  * Files can be added to cart. ([7437d426](https://github.com/NCI-GDC/portal-ui/commit/7437d4263e2700b6d6a3802ee844f7d82fc8288d), closes [OICR-61](https://jira.opensciencedatacloud.org/browse/OICR-61))
  * updates search tables ([3aaf0b36](https://github.com/NCI-GDC/portal-ui/commit/3aaf0b367c83f0985bd206323d920a488866088a), closes [OICR-27](https://jira.opensciencedatacloud.org/browse/OICR-27))
* **table:**
  * add size filter projs ([b611c80a](https://github.com/NCI-GDC/portal-ui/commit/b611c80a4454e5dacf3993076d20fa652a7a8477))
  * add table directive to search page ([1ed88acc](https://github.com/NCI-GDC/portal-ui/commit/1ed88accaad15d84096b57c1adba297c1f098e11), closes [OICR-215](https://jira.opensciencedatacloud.org/browse/OICR-215))
  * implement table directive ([28bafce7](https://github.com/NCI-GDC/portal-ui/commit/28bafce7d99408629912460495d9cc184511151d), closes [OICR-205](https://jira.opensciencedatacloud.org/browse/OICR-205))
* **templates:** adds ids to tables for qa hooks ([86a43476](https://github.com/NCI-GDC/portal-ui/commit/86a434768e8fc40da4fb1c0e915e12c26859e7de))
* **user:**
  * Better handling of non user projects. ([305fc7ac](https://github.com/NCI-GDC/portal-ui/commit/305fc7acd7edc6eba119dab4e3fff267032bfb4c), closes [OICR-213](https://jira.opensciencedatacloud.org/browse/OICR-213))
  * Adds MyProjects feature. ([80167280](https://github.com/NCI-GDC/portal-ui/commit/80167280520988e1cd0427c3df961cd50ca8d20f), closes [OICR-170](https://jira.opensciencedatacloud.org/browse/OICR-170))


### 0.1.8-spr5 (2015-01-20)


#### Bug Fixes

* **facets:** display _missing terms ([989a8b58](https://github.com/NCI-GDC/portal-ui/commit/989a8b584cc2c14ba7e20e24ecc1e819095653f3), closes [OICR-172](https://jira.opensciencedatacloud.org/browse/OICR-172))


#### Features

* **app:**
  * undo add/remove files in notification ([2b24a742](https://github.com/NCI-GDC/portal-ui/commit/2b24a7420bafc5c3b3dad1b9607e250ccc3af222), closes [OICR-169](https://jira.opensciencedatacloud.org/browse/OICR-169))
  * Create table sorting directive ([420e25f1](https://github.com/NCI-GDC/portal-ui/commit/420e25f117a4f5c8cf05bc0d58fd8e37d70931fc), closes [OICR-195](https://jira.opensciencedatacloud.org/browse/OICR-195))
  * Loading spinner on page XHR requests ([b4e08621](https://github.com/NCI-GDC/portal-ui/commit/b4e08621d84d03b479113abd3f1d72a1f9e8f198))
  * link download btns w/ makeDownloadLink ([61c9126b](https://github.com/NCI-GDC/portal-ui/commit/61c9126bda323407084f6b4769b0febcae3cd17b), closes [OICR-165](https://jira.opensciencedatacloud.org/browse/OICR-165))
* **cart:** Add pagination to cart page. ([d568ad2d](https://github.com/NCI-GDC/portal-ui/commit/d568ad2def3fa08c4431c7aa24112e89a97bd845), closes [OICR-194](https://jira.opensciencedatacloud.org/browse/OICR-194))
* **core:** send js errors to API ([fd789b0c](https://github.com/NCI-GDC/portal-ui/commit/fd789b0c9b22c12a18f54509d0a97cce78d299f5), closes [OICR-212](https://jira.opensciencedatacloud.org/browse/OICR-212))
* **facets:** add id autosuggest support. ([50c5ab2a](https://github.com/NCI-GDC/portal-ui/commit/50c5ab2aacf890cd8759550180b145a5dc982254), closes [OICR-173](https://jira.opensciencedatacloud.org/browse/OICR-173))
* **gql:** adds gql directive ([05583eac](https://github.com/NCI-GDC/portal-ui/commit/05583eac9c05a7ecf549df3859c0a3157c9d94fa))
* **participants:** Initial Biospecimen section. ([e8579df0](https://github.com/NCI-GDC/portal-ui/commit/e8579df0b8a0640eba837e948f2989fb7acb87be), closes [OICR-209](https://jira.opensciencedatacloud.org/browse/OICR-209))
* **search:**
  * search table header actions ([f929b2a2](https://github.com/NCI-GDC/portal-ui/commit/f929b2a26f44ce8b701895ee618b842ce367f1f7), closes [OICR-193](https://jira.opensciencedatacloud.org/browse/OICR-193))
  * Switch back to Tabs for facets. ([175c971d](https://github.com/NCI-GDC/portal-ui/commit/175c971d2ec2c88920ff99a9a8a53e2b511ce8a1), closes [OICR-208](https://jira.opensciencedatacloud.org/browse/OICR-208))
  * add tumor tissue status ([7db74e40](https://github.com/NCI-GDC/portal-ui/commit/7db74e40b63ca01a47d3053b29dd6a273712a028), closes [OICR-187](https://jira.opensciencedatacloud.org/browse/OICR-187))
* **table:**
  * add table directive to search page ([1ed88acc](https://github.com/NCI-GDC/portal-ui/commit/1ed88accaad15d84096b57c1adba297c1f098e11), closes [OICR-215](https://jira.opensciencedatacloud.org/browse/OICR-215))
  * implement table directive ([28bafce7](https://github.com/NCI-GDC/portal-ui/commit/28bafce7d99408629912460495d9cc184511151d), closes [OICR-205](https://jira.opensciencedatacloud.org/browse/OICR-205))
* **templates:** adds ids to tables for qa hooks ([86a43476](https://github.com/NCI-GDC/portal-ui/commit/86a434768e8fc40da4fb1c0e915e12c26859e7de))
* **user:** Better handling of non user projects. ([305fc7ac](https://github.com/NCI-GDC/portal-ui/commit/305fc7acd7edc6eba119dab4e3fff267032bfb4c), closes [OICR-213](https://jira.opensciencedatacloud.org/browse/OICR-213))


### 0.1.8-spr4 (2014-12-23)


#### Features

* **a11y:** Continued improvement w/ 508 comp. ([a6efdd2c](https://github.com/NCI-GDC/portal-ui/commit/a6efdd2c765f52b6bc63369a1a6823d014c27acc), closes [OICR-158](https://jira.opensciencedatacloud.org/browse/OICR-158))
* **app:**
  * adds undo to cart notification ([01bf7cc5](https://github.com/NCI-GDC/portal-ui/commit/01bf7cc5453b1813fcc12cdb928ddab7252384d2), closes [OICR-169](https://jira.opensciencedatacloud.org/browse/OICR-169))
  * notify when file added to cart ([5f0395e0](https://github.com/NCI-GDC/portal-ui/commit/5f0395e0dd8bb94f068597b7e7f8d834b1699767), closes [OICR-168](https://jira.opensciencedatacloud.org/browse/OICR-168))
  * Create reusable pagination controls. ([2390115a](https://github.com/NCI-GDC/portal-ui/commit/2390115a79c85a0c92a96c9783ba87ee8f4b39b6), closes [OICR-159](https://jira.opensciencedatacloud.org/browse/OICR-159))
  * some fixes to table contents ([35e653ac](https://github.com/NCI-GDC/portal-ui/commit/35e653ac9b14bfb32c94d63bae7c7da831762659), closes [OICR-160](https://jira.opensciencedatacloud.org/browse/OICR-160))
* **files:** add back remove frm cart & archive cell ([67cc52e3](https://github.com/NCI-GDC/portal-ui/commit/67cc52e3c324cf5dbbc48948d8aa8ce920537be7), closes [OICR-162](https://jira.opensciencedatacloud.org/browse/OICR-162))
* **filter:** add humanify filter ([c47fa078](https://github.com/NCI-GDC/portal-ui/commit/c47fa078a11b4ed180ee8acc1a67ec4b31b47221), closes [OICR-166](https://jira.opensciencedatacloud.org/browse/OICR-166))
* **login:** Mockup login process. ([51b052f1](https://github.com/NCI-GDC/portal-ui/commit/51b052f13676fae14b90bbac3907e20345a07271), closes [OICR-167](https://jira.opensciencedatacloud.org/browse/OICR-167))
* **search:**
  * add dropdwn archive & metafiles link ([9320130f](https://github.com/NCI-GDC/portal-ui/commit/9320130f58594a0447f21070e39cc2608abc1099), closes [OICR-161](https://jira.opensciencedatacloud.org/browse/OICR-161))
  * Participant buttons add files. ([b25ba9b3](https://github.com/NCI-GDC/portal-ui/commit/b25ba9b39e79f6e8026f9f8198dbfda4a8e0595a), closes [OICR-164](https://jira.opensciencedatacloud.org/browse/OICR-164))
* **user:** Adds MyProjects feature. ([80167280](https://github.com/NCI-GDC/portal-ui/commit/80167280520988e1cd0427c3df961cd50ca8d20f), closes [OICR-170](https://jira.opensciencedatacloud.org/browse/OICR-170))


### 0.1.8-spr3 (2014-12-11)


#### Bug Fixes

* **facets:**
  * use indexOf ([329016fe](https://github.com/NCI-GDC/portal-ui/commit/329016fe45cd9770c48b53b7e02a902dda013b8c))
  * don't allow dup terms to be added ([da56974d](https://github.com/NCI-GDC/portal-ui/commit/da56974d9cbed3f1a9ea103dff0765fa112d2491))


#### Features

* **annotations:** hook up id search ([b14c2303](https://github.com/NCI-GDC/portal-ui/commit/b14c23039c8f495b3789d340d5eaac2c3d33fb10))
* **app:**
  * Adds progress bar indicator. ([f64b4ce1](https://github.com/NCI-GDC/portal-ui/commit/f64b4ce1b28581e5c2760f8e03a9f03bb1d04476), closes [OICR-126](https://jira.opensciencedatacloud.org/browse/OICR-126))
  * check content of modules ([735b2271](https://github.com/NCI-GDC/portal-ui/commit/735b2271963c6b40415895d133c2b2bd9f3c5320), closes [OICR-131](https://jira.opensciencedatacloud.org/browse/OICR-131))
  * Generate front end config file. ([8e97245a](https://github.com/NCI-GDC/portal-ui/commit/8e97245a5f3443a9d0e248beff765ab866bdae7e), closes [OICR-125](https://jira.opensciencedatacloud.org/browse/OICR-125))
* **build:** Production environment build step. ([b2a63e02](https://github.com/NCI-GDC/portal-ui/commit/b2a63e02e437cc3e39b8adb97494fe9a0d9bda8b), closes [OICR-146](https://jira.opensciencedatacloud.org/browse/OICR-146))
* **cart:** update cart buttons/actions ([5c48317c](https://github.com/NCI-GDC/portal-ui/commit/5c48317c1347b0ab772d0c793900cf7fc9f7d285), closes [OICR-137](https://jira.opensciencedatacloud.org/browse/OICR-137))
* **current:** allows multi terms ([1d293a2c](https://github.com/NCI-GDC/portal-ui/commit/1d293a2c25527736598bd027932480539e6c1dfe))
* **facets:** hooks up id facet with LocationService ([c87aa5b0](https://github.com/NCI-GDC/portal-ui/commit/c87aa5b02579e3513029690ded24fa39e9ff947b), closes [OICR-143](https://jira.opensciencedatacloud.org/browse/OICR-143))
* **files:**
  * field/facet updates ([89ad7e0a](https://github.com/NCI-GDC/portal-ui/commit/89ad7e0a6f58c35bcab86bf6798364d7e92ceb1f))
  * Adds file size filter. ([fd944876](https://github.com/NCI-GDC/portal-ui/commit/fd9448769ff85db02e27ff2563a754baaff42629), closes [OICR-82](https://jira.opensciencedatacloud.org/browse/OICR-82))
* **models:** field updates ([219996cb](https://github.com/NCI-GDC/portal-ui/commit/219996cb210015063fb000c0cb3e44c9656441ae))
* **projects:**
  * updates project search links ([7c6cb981](https://github.com/NCI-GDC/portal-ui/commit/7c6cb981ffb9851db7a5da141646544264b9c347))
  * hook up project code search ([6804785c](https://github.com/NCI-GDC/portal-ui/commit/6804785cc60feb731fe786efeeb1afd17e2c43f1))
* **reports:** basic pie-chart directive ([1dd05975](https://github.com/NCI-GDC/portal-ui/commit/1dd0597561b34229d6ec5336529dfb2c072c2d0a), closes [OICR-109](https://jira.opensciencedatacloud.org/browse/OICR-109))
* **search:**
  * support xfilter on facets ([59d1222e](https://github.com/NCI-GDC/portal-ui/commit/59d1222eb9d3c79e04da8ac2ada83b5dd042579d), closes [OICR-133](https://jira.opensciencedatacloud.org/browse/OICR-133))
  * Add advanced query toggle. ([1aac50bb](https://github.com/NCI-GDC/portal-ui/commit/1aac50bb14e5160158be2414fcae4dd5079b34d5), closes [OICR-95](https://jira.opensciencedatacloud.org/browse/OICR-95))
  * Update Annotations Page ([8659e86b](https://github.com/NCI-GDC/portal-ui/commit/8659e86bb922969cefe9408a718702458d473d7c), closes [OICR-130](https://jira.opensciencedatacloud.org/browse/OICR-130))


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


