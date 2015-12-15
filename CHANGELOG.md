<a name"0.2.18"></a>
### 0.2.18 (2015-12-15)


#### Bug Fixes

* **files:** seperate directives for dl & slicing ([d6c4dde6](https://github.com/NCI-GDC/portal-ui/commit/d6c4dde6))
* **search:** disease_type doesn't autofilter ([21ed658e](https://github.com/NCI-GDC/portal-ui/commit/21ed658e), closes [OICR-1206](https://jira.opensciencedatacloud.org/browse/OICR-1206))


#### Features

* **file:** bam slicing ui ([18177049](https://github.com/NCI-GDC/portal-ui/commit/18177049), closes [OICR-1432](https://jira.opensciencedatacloud.org/browse/OICR-1432))


<a name"0.2.18"></a>
### 0.2.18 (2015-12-15)


<a name"0.2.18-spr3"></a>
### 0.2.18-spr3 (2015-11-25)


#### Bug Fixes

* **files:** seperate directives for dl & slicing ([d6c4dde6](https://github.com/NCI-GDC/portal-ui/commit/d6c4dde6))
* **search:** disease_type doesn't autofilter ([21ed658e](https://github.com/NCI-GDC/portal-ui/commit/21ed658e), closes [OICR-1206](https://jira.opensciencedatacloud.org/browse/OICR-1206))


#### Features

* **file:** bam slicing ui ([18177049](https://github.com/NCI-GDC/portal-ui/commit/18177049), closes [OICR-1432](https://jira.opensciencedatacloud.org/browse/OICR-1432))


<a name"0.2.15"></a>
### 0.2.15 (2015-09-30)


#### Bug Fixes

* **UserService:**
  * set unauthed user from cookie ([1773393c](https://github.com/NCI-GDC/portal-ui/commit/1773393c), closes [OICR-1174](https://jira.opensciencedatacloud.org/browse/OICR-1174))
  * isUserProject works again ([72dbf4af](https://github.com/NCI-GDC/portal-ui/commit/72dbf4af), closes [OICR-1101](https://jira.opensciencedatacloud.org/browse/OICR-1101))
* **annotations:** no autocomplete for entity/case ([ae7ff66d](https://github.com/NCI-GDC/portal-ui/commit/ae7ff66d), closes [OICR-1102](https://jira.opensciencedatacloud.org/browse/OICR-1102))
* **app:**
  * no startsWith ([9216550a](https://github.com/NCI-GDC/portal-ui/commit/9216550a), closes [OICR-1122](https://jira.opensciencedatacloud.org/browse/OICR-1122), [OICR-1125](https://jira.opensciencedatacloud.org/browse/OICR-1125), [OICR-1127](https://jira.opensciencedatacloud.org/browse/OICR-1127))
  * correct csrf header ([07a57e93](https://github.com/NCI-GDC/portal-ui/commit/07a57e93))
* **cart:**
  * fixes summary case count ([9789abfe](https://github.com/NCI-GDC/portal-ui/commit/9789abfe), closes [OICR-1183](https://jira.opensciencedatacloud.org/browse/OICR-1183))
  * table column alignments ([3f64a247](https://github.com/NCI-GDC/portal-ui/commit/3f64a247), closes [OICR-1093](https://jira.opensciencedatacloud.org/browse/OICR-1093))
  * fixes case/annotation links ([ccd24b88](https://github.com/NCI-GDC/portal-ui/commit/ccd24b88), closes [OICR-1181](https://jira.opensciencedatacloud.org/browse/OICR-1181))
  * update gdc-client help text ([06cf7493](https://github.com/NCI-GDC/portal-ui/commit/06cf7493), closes [OICR-1130](https://jira.opensciencedatacloud.org/browse/OICR-1130))
  * return all files in manifest ([2b86128e](https://github.com/NCI-GDC/portal-ui/commit/2b86128e), closes [OICR-1120](https://jira.opensciencedatacloud.org/browse/OICR-1120))
  * button alignment ([4c9675aa](https://github.com/NCI-GDC/portal-ui/commit/4c9675aa), closes [OICR-1106](https://jira.opensciencedatacloud.org/browse/OICR-1106))
* **case:**
  * missed name->field rename ([dfb93e4d](https://github.com/NCI-GDC/portal-ui/commit/dfb93e4d))
  * adds taget=_blank to xml links ([20831279](https://github.com/NCI-GDC/portal-ui/commit/20831279), closes [OICR-1138](https://jira.opensciencedatacloud.org/browse/OICR-1138), [OICR-1124](https://jira.opensciencedatacloud.org/browse/OICR-1124))
* **facets:** expand date input ([86c81f11](https://github.com/NCI-GDC/portal-ui/commit/86c81f11), closes [OICR-1077](https://jira.opensciencedatacloud.org/browse/OICR-1077))
* **facetsFreeText:** do nothing if empty term ([c1b8b531](https://github.com/NCI-GDC/portal-ui/commit/c1b8b531), closes [OICR-1053](https://jira.opensciencedatacloud.org/browse/OICR-1053))
* **githut:** no neg rect widths ([41238931](https://github.com/NCI-GDC/portal-ui/commit/41238931), closes [OICR-1006](https://jira.opensciencedatacloud.org/browse/OICR-1006))
* **header:** hide MyProjects btn when 0 projects ([b74c7b9b](https://github.com/NCI-GDC/portal-ui/commit/b74c7b9b))
* **notify:** add word-break for long filenames ([a0165001](https://github.com/NCI-GDC/portal-ui/commit/a0165001), closes [OICR-1123](https://jira.opensciencedatacloud.org/browse/OICR-1123))
* **pagination:** toJson before setting ([b6de0f76](https://github.com/NCI-GDC/portal-ui/commit/b6de0f76), closes [OICR-1184](https://jira.opensciencedatacloud.org/browse/OICR-1184))
* **paging:** set pg to 1 when facet added/removed ([60c233b6](https://github.com/NCI-GDC/portal-ui/commit/60c233b6), closes [OICR-1129](https://jira.opensciencedatacloud.org/browse/OICR-1129))
* **project:** 0 case fixes ([8cc13595](https://github.com/NCI-GDC/portal-ui/commit/8cc13595), closes [OICR-1128](https://jira.opensciencedatacloud.org/browse/OICR-1128))
* **projects:**
  * fixes links to search tabs ([805ba74a](https://github.com/NCI-GDC/portal-ui/commit/805ba74a), closes [OICR-1187](https://jira.opensciencedatacloud.org/browse/OICR-1187))
  * missed name->field rename ([48b7c956](https://github.com/NCI-GDC/portal-ui/commit/48b7c956))
* **rangeFacets:**
  * show default selected input ([877ad596](https://github.com/NCI-GDC/portal-ui/commit/877ad596))
  * use ng-click not ng-change ([95f049a6](https://github.com/NCI-GDC/portal-ui/commit/95f049a6))
* **reports:** remove * 1e6 ([b7facccd](https://github.com/NCI-GDC/portal-ui/commit/b7facccd), closes [OICR-1207](https://jira.opensciencedatacloud.org/browse/OICR-1207))
* **search:**
  * added aria-label attributes ([65a74a98](https://github.com/NCI-GDC/portal-ui/commit/65a74a98), closes [OICR-1134](https://jira.opensciencedatacloud.org/browse/OICR-1134), [OICR-1133](https://jira.opensciencedatacloud.org/browse/OICR-1133), [OICR-1136](https://jira.opensciencedatacloud.org/browse/OICR-1136))
  * missed name->field rename ([8ff104a5](https://github.com/NCI-GDC/portal-ui/commit/8ff104a5))
* **search.cases:** correctly check my projects ([f91a9d7b](https://github.com/NCI-GDC/portal-ui/commit/f91a9d7b), closes [OICR-1165](https://jira.opensciencedatacloud.org/browse/OICR-1165))
* **table:**
  * revert table sum row ([f8aca3d0](https://github.com/NCI-GDC/portal-ui/commit/f8aca3d0))
  * right align table headers ([28e40b57](https://github.com/NCI-GDC/portal-ui/commit/28e40b57), closes [OICR-1093](https://jira.opensciencedatacloud.org/browse/OICR-1093))
  * fixes column filtering ([266709b6](https://github.com/NCI-GDC/portal-ui/commit/266709b6), closes [OICR-1092](https://jira.opensciencedatacloud.org/browse/OICR-1092))
* **user:** don't use newuser cookie on 401 ([edc7880b](https://github.com/NCI-GDC/portal-ui/commit/edc7880b), closes [OICR-1189](https://jira.opensciencedatacloud.org/browse/OICR-1189))


#### Features

* **app:** send x-csrf-token with every post ([6508e77c](https://github.com/NCI-GDC/portal-ui/commit/6508e77c), closes [OICR-1103](https://jira.opensciencedatacloud.org/browse/OICR-1103))
* **cart:**
  * spinner stops on fail, alerts user ([797d84cb](https://github.com/NCI-GDC/portal-ui/commit/797d84cb), closes [OICR-1182](https://jira.opensciencedatacloud.org/browse/OICR-1182))
  * download btn in cart has spinning indicator ([0eac1155](https://github.com/NCI-GDC/portal-ui/commit/0eac1155))
* **core:**
  * show unsupported browser warning ([b29ef335](https://github.com/NCI-GDC/portal-ui/commit/b29ef335), closes [OICR-1065](https://jira.opensciencedatacloud.org/browse/OICR-1065))
  * display login failed warning ([eb92352f](https://github.com/NCI-GDC/portal-ui/commit/eb92352f), closes [OICR-1069](https://jira.opensciencedatacloud.org/browse/OICR-1069))
* **doc:** Add instruction for git template ([23764759](https://github.com/NCI-GDC/portal-ui/commit/23764759))
* **facet-free-text:** drop down no results ([94f3ddfb](https://github.com/NCI-GDC/portal-ui/commit/94f3ddfb), closes [OICR-1050](https://jira.opensciencedatacloud.org/browse/OICR-1050))
* **files:** spinning indication on download buttons ([ec2c623e](https://github.com/NCI-GDC/portal-ui/commit/ec2c623e))
* **projects:** adds a totals row ([e2e53fe8](https://github.com/NCI-GDC/portal-ui/commit/e2e53fe8), closes [OICR-1132](https://jira.opensciencedatacloud.org/browse/OICR-1132))
* **query-summary:** display tooltip warnings ([aeee09c9](https://github.com/NCI-GDC/portal-ui/commit/aeee09c9), closes [OICR-1070](https://jira.opensciencedatacloud.org/browse/OICR-1070))
* **reports:**
  * export btn is independent template ([d22020f6](https://github.com/NCI-GDC/portal-ui/commit/d22020f6))
  * oicr-1020 minor UI changes ([3a254662](https://github.com/NCI-GDC/portal-ui/commit/3a254662))
* **search:** copy change in autocomplete ([0337963b](https://github.com/NCI-GDC/portal-ui/commit/0337963b))


<a name"0.2.15"></a>
### 0.2.15 (2015-09-30)


<a name"0.2.15-spr3"></a>
### 0.2.15-spr3 (2015-09-30)


#### Bug Fixes

* **pagination:** toJson before setting ([b6de0f76](https://github.com/NCI-GDC/portal-ui/commit/b6de0f76), closes [OICR-1184](https://jira.opensciencedatacloud.org/browse/OICR-1184))
* **reports:** remove * 1e6 ([b7facccd](https://github.com/NCI-GDC/portal-ui/commit/b7facccd), closes [OICR-1207](https://jira.opensciencedatacloud.org/browse/OICR-1207))
* **search:** added aria-label attributes ([65a74a98](https://github.com/NCI-GDC/portal-ui/commit/65a74a98), closes [OICR-1134](https://jira.opensciencedatacloud.org/browse/OICR-1134), [OICR-1133](https://jira.opensciencedatacloud.org/browse/OICR-1133), [OICR-1136](https://jira.opensciencedatacloud.org/browse/OICR-1136))
* **user:** don't use newuser cookie on 401 ([edc7880b](https://github.com/NCI-GDC/portal-ui/commit/edc7880b), closes [OICR-1189](https://jira.opensciencedatacloud.org/browse/OICR-1189))


<a name"0.2.15-spr2"></a>
### 0.2.15-spr2 (2015-08-31)


#### Bug Fixes

* **UserService:** set unauthed user from cookie ([1773393c](https://github.com/NCI-GDC/portal-ui/commit/1773393c), closes [OICR-1174](https://jira.opensciencedatacloud.org/browse/OICR-1174))
* **cart:**
  * fixes summary case count ([9789abfe](https://github.com/NCI-GDC/portal-ui/commit/9789abfe), closes [OICR-1183](https://jira.opensciencedatacloud.org/browse/OICR-1183))
  * table column alignments ([3f64a247](https://github.com/NCI-GDC/portal-ui/commit/3f64a247), closes [OICR-1093](https://jira.opensciencedatacloud.org/browse/OICR-1093))
  * fixes case/annotation links ([ccd24b88](https://github.com/NCI-GDC/portal-ui/commit/ccd24b88), closes [OICR-1181](https://jira.opensciencedatacloud.org/browse/OICR-1181))
* **case:** missed name->field rename ([dfb93e4d](https://github.com/NCI-GDC/portal-ui/commit/dfb93e4d))
* **header:** hide MyProjects btn when 0 projects ([b74c7b9b](https://github.com/NCI-GDC/portal-ui/commit/b74c7b9b))
* **projects:**
  * fixes links to search tabs ([805ba74a](https://github.com/NCI-GDC/portal-ui/commit/805ba74a), closes [OICR-1187](https://jira.opensciencedatacloud.org/browse/OICR-1187))
  * missed name->field rename ([48b7c956](https://github.com/NCI-GDC/portal-ui/commit/48b7c956))
* **search:** missed name->field rename ([8ff104a5](https://github.com/NCI-GDC/portal-ui/commit/8ff104a5))
* **search.cases:** correctly check my projects ([f91a9d7b](https://github.com/NCI-GDC/portal-ui/commit/f91a9d7b), closes [OICR-1165](https://jira.opensciencedatacloud.org/browse/OICR-1165))
* **table:** revert table sum row ([f8aca3d0](https://github.com/NCI-GDC/portal-ui/commit/f8aca3d0))


#### Features

* **cart:**
  * spinner stops on fail, alerts user ([797d84cb](https://github.com/NCI-GDC/portal-ui/commit/797d84cb), closes [OICR-1182](https://jira.opensciencedatacloud.org/browse/OICR-1182))
  * download btn in cart has spinning indicator ([0eac1155](https://github.com/NCI-GDC/portal-ui/commit/0eac1155))
* **files:** spinning indication on download buttons ([ec2c623e](https://github.com/NCI-GDC/portal-ui/commit/ec2c623e))
* **reports:**
  * export btn is independent template ([d22020f6](https://github.com/NCI-GDC/portal-ui/commit/d22020f6))
  * oicr-1020 minor UI changes ([3a254662](https://github.com/NCI-GDC/portal-ui/commit/3a254662))
* **search:** copy change in autocomplete ([0337963b](https://github.com/NCI-GDC/portal-ui/commit/0337963b))


<a name"0.2.15-spr1"></a>
### 0.2.15-spr1 (2015-08-07)


#### Bug Fixes

* **UserService:** isUserProject works again ([72dbf4af](https://github.com/NCI-GDC/portal-ui/commit/72dbf4af), closes [OICR-1101](https://jira.opensciencedatacloud.org/browse/OICR-1101))
* **annotations:** no autocomplete for entity/case ([ae7ff66d](https://github.com/NCI-GDC/portal-ui/commit/ae7ff66d), closes [OICR-1102](https://jira.opensciencedatacloud.org/browse/OICR-1102))
* **app:**
  * no startsWith ([9216550a](https://github.com/NCI-GDC/portal-ui/commit/9216550a), closes [OICR-1122](https://jira.opensciencedatacloud.org/browse/OICR-1122), [OICR-1125](https://jira.opensciencedatacloud.org/browse/OICR-1125), [OICR-1127](https://jira.opensciencedatacloud.org/browse/OICR-1127))
  * correct csrf header ([07a57e93](https://github.com/NCI-GDC/portal-ui/commit/07a57e93))
* **cart:**
  * update gdc-client help text ([06cf7493](https://github.com/NCI-GDC/portal-ui/commit/06cf7493), closes [OICR-1130](https://jira.opensciencedatacloud.org/browse/OICR-1130))
  * return all files in manifest ([2b86128e](https://github.com/NCI-GDC/portal-ui/commit/2b86128e), closes [OICR-1120](https://jira.opensciencedatacloud.org/browse/OICR-1120))
  * button alignment ([4c9675aa](https://github.com/NCI-GDC/portal-ui/commit/4c9675aa), closes [OICR-1106](https://jira.opensciencedatacloud.org/browse/OICR-1106))
* **case:** adds taget=_blank to xml links ([20831279](https://github.com/NCI-GDC/portal-ui/commit/20831279), closes [OICR-1138](https://jira.opensciencedatacloud.org/browse/OICR-1138), [OICR-1124](https://jira.opensciencedatacloud.org/browse/OICR-1124))
* **facets:** expand date input ([86c81f11](https://github.com/NCI-GDC/portal-ui/commit/86c81f11), closes [OICR-1077](https://jira.opensciencedatacloud.org/browse/OICR-1077))
* **facetsFreeText:** do nothing if empty term ([c1b8b531](https://github.com/NCI-GDC/portal-ui/commit/c1b8b531), closes [OICR-1053](https://jira.opensciencedatacloud.org/browse/OICR-1053))
* **githut:** no neg rect widths ([41238931](https://github.com/NCI-GDC/portal-ui/commit/41238931), closes [OICR-1006](https://jira.opensciencedatacloud.org/browse/OICR-1006))
* **notify:** add word-break for long filenames ([a0165001](https://github.com/NCI-GDC/portal-ui/commit/a0165001), closes [OICR-1123](https://jira.opensciencedatacloud.org/browse/OICR-1123))
* **paging:** set pg to 1 when facet added/removed ([60c233b6](https://github.com/NCI-GDC/portal-ui/commit/60c233b6), closes [OICR-1129](https://jira.opensciencedatacloud.org/browse/OICR-1129))
* **project:** 0 case fixes ([8cc13595](https://github.com/NCI-GDC/portal-ui/commit/8cc13595), closes [OICR-1128](https://jira.opensciencedatacloud.org/browse/OICR-1128))
* **rangeFacets:**
  * show default selected input ([877ad596](https://github.com/NCI-GDC/portal-ui/commit/877ad596))
  * use ng-click not ng-change ([95f049a6](https://github.com/NCI-GDC/portal-ui/commit/95f049a6))
* **table:**
  * right align table headers ([28e40b57](https://github.com/NCI-GDC/portal-ui/commit/28e40b57), closes [OICR-1093](https://jira.opensciencedatacloud.org/browse/OICR-1093))
  * fixes column filtering ([266709b6](https://github.com/NCI-GDC/portal-ui/commit/266709b6), closes [OICR-1092](https://jira.opensciencedatacloud.org/browse/OICR-1092))


#### Features

* **app:** send x-csrf-token with every post ([6508e77c](https://github.com/NCI-GDC/portal-ui/commit/6508e77c), closes [OICR-1103](https://jira.opensciencedatacloud.org/browse/OICR-1103))
* **core:**
  * show unsupported browser warning ([b29ef335](https://github.com/NCI-GDC/portal-ui/commit/b29ef335), closes [OICR-1065](https://jira.opensciencedatacloud.org/browse/OICR-1065))
  * display login failed warning ([eb92352f](https://github.com/NCI-GDC/portal-ui/commit/eb92352f), closes [OICR-1069](https://jira.opensciencedatacloud.org/browse/OICR-1069))
* **doc:** Add instruction for git template ([23764759](https://github.com/NCI-GDC/portal-ui/commit/23764759))
* **facet-free-text:** drop down no results ([94f3ddfb](https://github.com/NCI-GDC/portal-ui/commit/94f3ddfb), closes [OICR-1050](https://jira.opensciencedatacloud.org/browse/OICR-1050))
* **projects:** adds a totals row ([e2e53fe8](https://github.com/NCI-GDC/portal-ui/commit/e2e53fe8), closes [OICR-1132](https://jira.opensciencedatacloud.org/browse/OICR-1132))
* **query-summary:** display tooltip warnings ([aeee09c9](https://github.com/NCI-GDC/portal-ui/commit/aeee09c9), closes [OICR-1070](https://jira.opensciencedatacloud.org/browse/OICR-1070))


<a name"0.2.13"></a>
### 0.2.13 (2015-07-28)


#### Bug Fixes

* **add-to-cart:** use gettext getPlural for msgs ([501dfaeb](https://github.com/NCI-GDC/portal-ui/commit/501dfaeb), closes [OICR-927](https://jira.opensciencedatacloud.org/browse/OICR-927))
* **adv-search:** working when authed ([0a60a412](https://github.com/NCI-GDC/portal-ui/commit/0a60a412), closes [OICR-1067](https://jira.opensciencedatacloud.org/browse/OICR-1067))
* **ageDisplay:** use years/days instead of ys/ds ([85956828](https://github.com/NCI-GDC/portal-ui/commit/85956828), closes [OICR-1094](https://jira.opensciencedatacloud.org/browse/OICR-1094))
* **annotation:** humanify center notification ([fa450691](https://github.com/NCI-GDC/portal-ui/commit/fa450691), closes [OICR-634](https://jira.opensciencedatacloud.org/browse/OICR-634))
* **app:**
  * fix case clinical filtering ([43817f41](https://github.com/NCI-GDC/portal-ui/commit/43817f41))
  * Missing case link changes ([3149a860](https://github.com/NCI-GDC/portal-ui/commit/3149a860))
  * change pagination key to cases ([700287ba](https://github.com/NCI-GDC/portal-ui/commit/700287ba))
  * change participants.projects to cases.projects ([27053b91](https://github.com/NCI-GDC/portal-ui/commit/27053b91))
  * fix link urls for participant -> case ([e51277eb](https://github.com/NCI-GDC/portal-ui/commit/e51277eb))
  * Update from participant_id to case_id ([a371fc7e](https://github.com/NCI-GDC/portal-ui/commit/a371fc7e), closes [OICR-1042](https://jira.opensciencedatacloud.org/browse/OICR-1042))
  * Ensure all models remove backdrop. ([f019c4f1](https://github.com/NCI-GDC/portal-ui/commit/f019c4f1), closes [OICR-938](https://jira.opensciencedatacloud.org/browse/OICR-938))
  * Fix random infinite loops ([bbba42f9](https://github.com/NCI-GDC/portal-ui/commit/bbba42f9))
  * Fix broken dropdown menus. ([65c1deb2](https://github.com/NCI-GDC/portal-ui/commit/65c1deb2))
  * Entity counts of 1 link direct to entity ([a5f76436](https://github.com/NCI-GDC/portal-ui/commit/a5f76436), closes [OICR-584](https://jira.opensciencedatacloud.org/browse/OICR-584))
* **auth:**
  * Set auth links to config url ([841d77e9](https://github.com/NCI-GDC/portal-ui/commit/841d77e9))
  * Fix some defaults used in auth. ([6d3bbfe8](https://github.com/NCI-GDC/portal-ui/commit/6d3bbfe8))
  * Fix token download. ([120a1237](https://github.com/NCI-GDC/portal-ui/commit/120a1237), closes [OICR-743](https://jira.opensciencedatacloud.org/browse/OICR-743))
  * Cookies now on all API requests ([5b0228d3](https://github.com/NCI-GDC/portal-ui/commit/5b0228d3))
  * Always pass auth token in headers. ([06b6bb0d](https://github.com/NCI-GDC/portal-ui/commit/06b6bb0d))
* **build:**
  * Fix production builds ([cca3a9e6](https://github.com/NCI-GDC/portal-ui/commit/cca3a9e6))
  * Prevent silent errors from LESS. ([1df4f1e0](https://github.com/NCI-GDC/portal-ui/commit/1df4f1e0))
* **cart:**
  * Update copy for help area. ([4e8193ef](https://github.com/NCI-GDC/portal-ui/commit/4e8193ef), closes [OICR-1066](https://jira.opensciencedatacloud.org/browse/OICR-1066))
  * pie charts updated to summary card ([aff638b9](https://github.com/NCI-GDC/portal-ui/commit/aff638b9))
  * add filtered works with gql ([c5df14ed](https://github.com/NCI-GDC/portal-ui/commit/c5df14ed), closes [OICR-918](https://jira.opensciencedatacloud.org/browse/OICR-918))
  * correct case count ([c8f13ccf](https://github.com/NCI-GDC/portal-ui/commit/c8f13ccf), closes [OICR-894](https://jira.opensciencedatacloud.org/browse/OICR-894))
  * speed up add all to cart ([b10e16c6](https://github.com/NCI-GDC/portal-ui/commit/b10e16c6), closes [OICR-886](https://jira.opensciencedatacloud.org/browse/OICR-886))
  * Don't apply myproject filter for chart. ([e8b1474b](https://github.com/NCI-GDC/portal-ui/commit/e8b1474b), closes [OICR-881](https://jira.opensciencedatacloud.org/browse/OICR-881))
  * ui updates ([9a909383](https://github.com/NCI-GDC/portal-ui/commit/9a909383), closes [OICR-883](https://jira.opensciencedatacloud.org/browse/OICR-883))
  * cart item project id label ([4b23990e](https://github.com/NCI-GDC/portal-ui/commit/4b23990e), closes [OICR-870](https://jira.opensciencedatacloud.org/browse/OICR-870))
  * don't rename project_id to id ([6415191f](https://github.com/NCI-GDC/portal-ui/commit/6415191f))
  * update my projects col ([5e0dba20](https://github.com/NCI-GDC/portal-ui/commit/5e0dba20))
  * renames remove cart tooltip. ([065156a7](https://github.com/NCI-GDC/portal-ui/commit/065156a7), closes [OICR-856](https://jira.opensciencedatacloud.org/browse/OICR-856))
  * download button ([098df6e9](https://github.com/NCI-GDC/portal-ui/commit/098df6e9), closes [OICR-824](https://jira.opensciencedatacloud.org/browse/OICR-824))
  * fixes cart actions ([c0bb48a8](https://github.com/NCI-GDC/portal-ui/commit/c0bb48a8))
  * rm lzcompress from cart, too slow ([5d39d070](https://github.com/NCI-GDC/portal-ui/commit/5d39d070), closes [OICR-737](https://jira.opensciencedatacloud.org/browse/OICR-737))
  * Use proper directive for login. ([1219e89c](https://github.com/NCI-GDC/portal-ui/commit/1219e89c), closes [OICR-741](https://jira.opensciencedatacloud.org/browse/OICR-741))
  * Retrieve files before decompress ([82cf62c8](https://github.com/NCI-GDC/portal-ui/commit/82cf62c8))
  * dropdown toggle working again ([5ad0df54](https://github.com/NCI-GDC/portal-ui/commit/5ad0df54))
  * update header ([3c9b0955](https://github.com/NCI-GDC/portal-ui/commit/3c9b0955))
  * fix ([369c3b98](https://github.com/NCI-GDC/portal-ui/commit/369c3b98))
  * related_ids always defined ([b3c63ce3](https://github.com/NCI-GDC/portal-ui/commit/b3c63ce3), closes [OICR-646](https://jira.opensciencedatacloud.org/browse/OICR-646))
  * refactor cart ([acdf0f73](https://github.com/NCI-GDC/portal-ui/commit/acdf0f73), closes [OICR-648](https://jira.opensciencedatacloud.org/browse/OICR-648), [OICR-652](https://jira.opensciencedatacloud.org/browse/OICR-652))
  * icons ([584fe142](https://github.com/NCI-GDC/portal-ui/commit/584fe142))
  * fix chart update ([8b298101](https://github.com/NCI-GDC/portal-ui/commit/8b298101))
* **cart-graphs:** authorization instead of access ([0f148edc](https://github.com/NCI-GDC/portal-ui/commit/0f148edc), closes [OICR-879](https://jira.opensciencedatacloud.org/browse/OICR-879))
* **chart:**
  * stop click on chart in query ([96c3d36e](https://github.com/NCI-GDC/portal-ui/commit/96c3d36e), closes [OICR-953](https://jira.opensciencedatacloud.org/browse/OICR-953))
  * Ensure chart data is always sorted. ([87b4f17b](https://github.com/NCI-GDC/portal-ui/commit/87b4f17b), closes [OICR-890](https://jira.opensciencedatacloud.org/browse/OICR-890))
* **charts:** Ignore resize when not rendered. ([1c475570](https://github.com/NCI-GDC/portal-ui/commit/1c475570), closes [OICR-842](https://jira.opensciencedatacloud.org/browse/OICR-842))
* **config:** Move to a simpler config ([04c74e47](https://github.com/NCI-GDC/portal-ui/commit/04c74e47))
* **download:**
  * 1 file -> GET & related_files flag ([6dcb1a8d](https://github.com/NCI-GDC/portal-ui/commit/6dcb1a8d), closes [OICR-888](https://jira.opensciencedatacloud.org/browse/OICR-888))
  * send credentials ([244e413a](https://github.com/NCI-GDC/portal-ui/commit/244e413a))
* **export:**
  * export non hidden fields ([f72155d7](https://github.com/NCI-GDC/portal-ui/commit/f72155d7), closes [OICR-875](https://jira.opensciencedatacloud.org/browse/OICR-875))
  * Use FileSaver library for downloads. ([91be7013](https://github.com/NCI-GDC/portal-ui/commit/91be7013), closes [OICR-540](https://jira.opensciencedatacloud.org/browse/OICR-540))
* **export-tbl:** close modal properly ([a72a1964](https://github.com/NCI-GDC/portal-ui/commit/a72a1964), closes [OICR-955](https://jira.opensciencedatacloud.org/browse/OICR-955))
* **facet:** revert to make copy&paste work again ([dbe47442](https://github.com/NCI-GDC/portal-ui/commit/dbe47442), closes [OICR-1098](https://jira.opensciencedatacloud.org/browse/OICR-1098), [OICR-1100](https://jira.opensciencedatacloud.org/browse/OICR-1100))
* **facets:**
  * Fix flow issue on smaller screens. ([f0851393](https://github.com/NCI-GDC/portal-ui/commit/f0851393), closes [OICR-863](https://jira.opensciencedatacloud.org/browse/OICR-863))
  * project.name -> disease_type ([e893d286](https://github.com/NCI-GDC/portal-ui/commit/e893d286), closes [OICR-815](https://jira.opensciencedatacloud.org/browse/OICR-815))
  * autocomplete working again ([a94622a0](https://github.com/NCI-GDC/portal-ui/commit/a94622a0), closes [OICR-731](https://jira.opensciencedatacloud.org/browse/OICR-731))
  * Prevent duplicate IDs being added. ([1ba2ded3](https://github.com/NCI-GDC/portal-ui/commit/1ba2ded3), closes [OICR-707](https://jira.opensciencedatacloud.org/browse/OICR-707))
* **facets-free-text:** dont send empty filter ([2cd61179](https://github.com/NCI-GDC/portal-ui/commit/2cd61179), closes [OICR-1007](https://jira.opensciencedatacloud.org/browse/OICR-1007))
* **file:**
  * Fix text when file access controlled. ([1b16bd9b](https://github.com/NCI-GDC/portal-ui/commit/1b16bd9b), closes [OICR-1003](https://jira.opensciencedatacloud.org/browse/OICR-1003))
  * don't overlap when resize ([1d1c5aea](https://github.com/NCI-GDC/portal-ui/commit/1d1c5aea), closes [OICR-939](https://jira.opensciencedatacloud.org/browse/OICR-939))
  * Properly show assoc entity annotations. ([aab4f423](https://github.com/NCI-GDC/portal-ui/commit/aab4f423), closes [OICR-679](https://jira.opensciencedatacloud.org/browse/OICR-679))
  * Proper tag delimiter. ([daa9d041](https://github.com/NCI-GDC/portal-ui/commit/daa9d041), closes [OICR-642](https://jira.opensciencedatacloud.org/browse/OICR-642))
* **files:**
  * Size filter handles undefined val. ([0509a52f](https://github.com/NCI-GDC/portal-ui/commit/0509a52f), closes [OICR-835](https://jira.opensciencedatacloud.org/browse/OICR-835))
  * Petabyte filtering. ([982d082d](https://github.com/NCI-GDC/portal-ui/commit/982d082d), closes [OICR-577](https://jira.opensciencedatacloud.org/browse/OICR-577))
* **githut:**
  * hide tooltip on click ([33bd9f18](https://github.com/NCI-GDC/portal-ui/commit/33bd9f18), closes [OICR-827](https://jira.opensciencedatacloud.org/browse/OICR-827))
  * Text header overlapping. ([21ddb36e](https://github.com/NCI-GDC/portal-ui/commit/21ddb36e), closes [OICR-676](https://jira.opensciencedatacloud.org/browse/OICR-676))
* **githut-graph:** 0 not clickable ([93bf8c84](https://github.com/NCI-GDC/portal-ui/commit/93bf8c84), closes [OICR-897](https://jira.opensciencedatacloud.org/browse/OICR-897))
* **gql:**
  * participant -> case icon ([5d68f9bc](https://github.com/NCI-GDC/portal-ui/commit/5d68f9bc))
  * auto-insert [ if missing ([75d6b415](https://github.com/NCI-GDC/portal-ui/commit/75d6b415), closes [OICR-925](https://jira.opensciencedatacloud.org/browse/OICR-925))
  * mouse selects correct item ([da127155](https://github.com/NCI-GDC/portal-ui/commit/da127155))
  * updates error message ([83ce2223](https://github.com/NCI-GDC/portal-ui/commit/83ce2223), closes [OICR-946](https://jira.opensciencedatacloud.org/browse/OICR-946))
  * always start dd selection at top ([e733f022](https://github.com/NCI-GDC/portal-ui/commit/e733f022), closes [OICR-947](https://jira.opensciencedatacloud.org/browse/OICR-947))
  * better handling of default input with AS ([60bf0c96](https://github.com/NCI-GDC/portal-ui/commit/60bf0c96), closes [OICR-941](https://jira.opensciencedatacloud.org/browse/OICR-941))
  * better handling of trailing val in list ([b2d93bcc](https://github.com/NCI-GDC/portal-ui/commit/b2d93bcc), closes [OICR-940](https://jira.opensciencedatacloud.org/browse/OICR-940))
  * removes trailing value in list using AS ([0ede9274](https://github.com/NCI-GDC/portal-ui/commit/0ede9274), closes [OICR-928](https://jira.opensciencedatacloud.org/browse/OICR-928))
  * handle NOT IN in query and auto suggest ([4a639a1f](https://github.com/NCI-GDC/portal-ui/commit/4a639a1f), closes [OICR-926](https://jira.opensciencedatacloud.org/browse/OICR-926))
  * automatically add [ to list auto suggest ([ac52db7a](https://github.com/NCI-GDC/portal-ui/commit/ac52db7a), closes [OICR-925](https://jira.opensciencedatacloud.org/browse/OICR-925))
  * handles numbers in auto suggest ([bc86e48f](https://github.com/NCI-GDC/portal-ui/commit/bc86e48f), closes [OICR-910](https://jira.opensciencedatacloud.org/browse/OICR-910))
  * removes _missing from suggest ([aa9ead6e](https://github.com/NCI-GDC/portal-ui/commit/aa9ead6e), closes [OICR-916](https://jira.opensciencedatacloud.org/browse/OICR-916))
  * adds autosuggest support for missing ([5c2640ae](https://github.com/NCI-GDC/portal-ui/commit/5c2640ae), closes [OICR-912](https://jira.opensciencedatacloud.org/browse/OICR-912))
  * remove old value ([e89845af](https://github.com/NCI-GDC/portal-ui/commit/e89845af), closes [OICR-911](https://jira.opensciencedatacloud.org/browse/OICR-911))
  * removes second auto suggest on space ([2212e5de](https://github.com/NCI-GDC/portal-ui/commit/2212e5de), closes [OICR-898](https://jira.opensciencedatacloud.org/browse/OICR-898))
* **header:** Don't use dropdown on xs view. ([dd3cef5a](https://github.com/NCI-GDC/portal-ui/commit/dd3cef5a), closes [OICR-744](https://jira.opensciencedatacloud.org/browse/OICR-744))
* **home:** update home link ([c1677f6e](https://github.com/NCI-GDC/portal-ui/commit/c1677f6e))
* **ie:** Remove usage of const. ([a1d6efd5](https://github.com/NCI-GDC/portal-ui/commit/a1d6efd5), closes [OICR-838](https://jira.opensciencedatacloud.org/browse/OICR-838), [OICR-805](https://jira.opensciencedatacloud.org/browse/OICR-805))
* **login:**
  * Switches back to per request creds. ([40d35a42](https://github.com/NCI-GDC/portal-ui/commit/40d35a42))
  * Login didn't correctly pass headers. ([92d3ca09](https://github.com/NCI-GDC/portal-ui/commit/92d3ca09))
* **participant:**
  * correct sref to 1 annotation ([a936822d](https://github.com/NCI-GDC/portal-ui/commit/a936822d))
  * Don't expand default sample. ([c0ec6998](https://github.com/NCI-GDC/portal-ui/commit/c0ec6998), closes [OICR-943](https://jira.opensciencedatacloud.org/browse/OICR-943))
  * Make TARGET data accessible. ([e9250bb1](https://github.com/NCI-GDC/portal-ui/commit/e9250bb1), closes [OICR-826](https://jira.opensciencedatacloud.org/browse/OICR-826))
  * UI fixes for sample changes. ([4172ed4d](https://github.com/NCI-GDC/portal-ui/commit/4172ed4d), closes [OICR-631](https://jira.opensciencedatacloud.org/browse/OICR-631))
* **pc:** advanced search fix ([ce7e20d8](https://github.com/NCI-GDC/portal-ui/commit/ce7e20d8))
* **project:** Update project summary title. ([82359499](https://github.com/NCI-GDC/portal-ui/commit/82359499), closes [OICR-1015](https://jira.opensciencedatacloud.org/browse/OICR-1015))
* **projects:**
  * Hide pagination controls. ([7e874922](https://github.com/NCI-GDC/portal-ui/commit/7e874922), closes [OICR-709](https://jira.opensciencedatacloud.org/browse/OICR-709))
  * expand .data_types and .exper_strat ([5a1b9e64](https://github.com/NCI-GDC/portal-ui/commit/5a1b9e64), closes [OICR-686](https://jira.opensciencedatacloud.org/browse/OICR-686))
  * summary tab counts not calculating ([f3aa96c0](https://github.com/NCI-GDC/portal-ui/commit/f3aa96c0), closes [OICR-684](https://jira.opensciencedatacloud.org/browse/OICR-684))
* **qsearch:**
  * fix quick search for cases ([bf707891](https://github.com/NCI-GDC/portal-ui/commit/bf707891))
  * Fix portion ids not highlighting ([c49bd217](https://github.com/NCI-GDC/portal-ui/commit/c49bd217))
* **query:**
  * switch case and files tab order ([800d6df5](https://github.com/NCI-GDC/portal-ui/commit/800d6df5), closes [OICR-909](https://jira.opensciencedatacloud.org/browse/OICR-909))
  * Ensure summary graphs load. ([3675cb41](https://github.com/NCI-GDC/portal-ui/commit/3675cb41), closes [OICR-908](https://jira.opensciencedatacloud.org/browse/OICR-908))
  * fixes range queries ([37376e71](https://github.com/NCI-GDC/portal-ui/commit/37376e71), closes [OICR-820](https://jira.opensciencedatacloud.org/browse/OICR-820))
  * fixes summary tab ([946b0408](https://github.com/NCI-GDC/portal-ui/commit/946b0408))
  * Fix tab loading. ([ee1c0dc9](https://github.com/NCI-GDC/portal-ui/commit/ee1c0dc9))
* **quick:** Ensure modal backdrop disappears. ([05354be6](https://github.com/NCI-GDC/portal-ui/commit/05354be6), closes [OICR-921](https://jira.opensciencedatacloud.org/browse/OICR-921), [OICR-907](https://jira.opensciencedatacloud.org/browse/OICR-907))
* **range:** min and max issues ([839cb8ce](https://github.com/NCI-GDC/portal-ui/commit/839cb8ce), closes [OICR-829](https://jira.opensciencedatacloud.org/browse/OICR-829), [OICR-804](https://jira.opensciencedatacloud.org/browse/OICR-804))
* **range-facet:** fix n undefined error ([0f05aa22](https://github.com/NCI-GDC/portal-ui/commit/0f05aa22))
* **range-facets:** rm unit conv frm days to death ([273fbfca](https://github.com/NCI-GDC/portal-ui/commit/273fbfca))
* **range-ui:** only allow num & don't show weeks ([93f06756](https://github.com/NCI-GDC/portal-ui/commit/93f06756))
* **reports:** table header ([5ea190ca](https://github.com/NCI-GDC/portal-ui/commit/5ea190ca))
* **reports-githut:** fix and add tooltiptext ([df37a7b3](https://github.com/NCI-GDC/portal-ui/commit/df37a7b3), closes [OICR-708](https://jira.opensciencedatacloud.org/browse/OICR-708))
* **search:**
  * Always show count for cases. ([ca447dfa](https://github.com/NCI-GDC/portal-ui/commit/ca447dfa), closes [OICR-1064](https://jira.opensciencedatacloud.org/browse/OICR-1064))
  * Fix days to death facet. ([d8fc946e](https://github.com/NCI-GDC/portal-ui/commit/d8fc946e))
  * Fix add filtered files for case. ([24fa40aa](https://github.com/NCI-GDC/portal-ui/commit/24fa40aa), closes [OICR-1047](https://jira.opensciencedatacloud.org/browse/OICR-1047))
  * Maintain bolded case in matched terms ([8c7e146f](https://github.com/NCI-GDC/portal-ui/commit/8c7e146f))
  * Ensure facet selections always update ([0d141b76](https://github.com/NCI-GDC/portal-ui/commit/0d141b76), closes [OICR-882](https://jira.opensciencedatacloud.org/browse/OICR-882))
  * fix access pie click ([97c5a5e2](https://github.com/NCI-GDC/portal-ui/commit/97c5a5e2), closes [OICR-887](https://jira.opensciencedatacloud.org/browse/OICR-887))
  * Case insensitive term match/highlight ([9bc4ded6](https://github.com/NCI-GDC/portal-ui/commit/9bc4ded6))
  * Close modal if on that entity page. ([96053443](https://github.com/NCI-GDC/portal-ui/commit/96053443), closes [OICR-854](https://jira.opensciencedatacloud.org/browse/OICR-854))
  * Cases loading is much quicker. ([54b3e22d](https://github.com/NCI-GDC/portal-ui/commit/54b3e22d), closes [OICR-831](https://jira.opensciencedatacloud.org/browse/OICR-831))
  * Fix matched term highlighting ([d928cbe3](https://github.com/NCI-GDC/portal-ui/commit/d928cbe3))
  * Reduce spacing on action buttons. ([195cc91a](https://github.com/NCI-GDC/portal-ui/commit/195cc91a), closes [OICR-795](https://jira.opensciencedatacloud.org/browse/OICR-795))
  * Remove all files button working. ([a119aa3c](https://github.com/NCI-GDC/portal-ui/commit/a119aa3c), closes [OICR-797](https://jira.opensciencedatacloud.org/browse/OICR-797))
  * Annotation columns right aligned. ([fe9fb987](https://github.com/NCI-GDC/portal-ui/commit/fe9fb987))
* **summary:**
  * Add UI for no results in cards. ([ce96782a](https://github.com/NCI-GDC/portal-ui/commit/ce96782a), closes [OICR-892](https://jira.opensciencedatacloud.org/browse/OICR-892))
  * Apply my projects filters. ([9085c148](https://github.com/NCI-GDC/portal-ui/commit/9085c148), closes [OICR-866](https://jira.opensciencedatacloud.org/browse/OICR-866))
* **summary-card:** needs graph for some reason ([8f0e30c1](https://github.com/NCI-GDC/portal-ui/commit/8f0e30c1))
* **table:**
  * fixes empty pagination ([12fbfc00](https://github.com/NCI-GDC/portal-ui/commit/12fbfc00), closes [OICR-914](https://jira.opensciencedatacloud.org/browse/OICR-914))
  * save table sort settings ([5361cd9a](https://github.com/NCI-GDC/portal-ui/commit/5361cd9a), closes [OICR-873](https://jira.opensciencedatacloud.org/browse/OICR-873))
* **tableicious:**
  * table not respecting LS ([7eace6c8](https://github.com/NCI-GDC/portal-ui/commit/7eace6c8))
  * autorefresh inactive headers ([863b64dc](https://github.com/NCI-GDC/portal-ui/commit/863b64dc))
* **tables:**
  * Fix export functionality ([963490fe](https://github.com/NCI-GDC/portal-ui/commit/963490fe))
  * Fix failing sort tests ([63b93431](https://github.com/NCI-GDC/portal-ui/commit/63b93431))
  * tableicious refactor ([25122ffc](https://github.com/NCI-GDC/portal-ui/commit/25122ffc))
* **tbls:** correctly arrange child headings again ([2ce5c4a6](https://github.com/NCI-GDC/portal-ui/commit/2ce5c4a6))
* **token:** Fix token downloading. ([d8f6ade4](https://github.com/NCI-GDC/portal-ui/commit/d8f6ade4), closes [OICR-743](https://jira.opensciencedatacloud.org/browse/OICR-743))
* **user:**
  * fixes file project check ([c033946f](https://github.com/NCI-GDC/portal-ui/commit/c033946f))
  * Icons in dropdown appear again. ([c73a05c3](https://github.com/NCI-GDC/portal-ui/commit/c73a05c3), closes [OICR-649](https://jira.opensciencedatacloud.org/browse/OICR-649))


#### Features

* **add-to-cart:** show adding toast after 1s ([ec8eeee5](https://github.com/NCI-GDC/portal-ui/commit/ec8eeee5), closes [OICR-860](https://jira.opensciencedatacloud.org/browse/OICR-860))
* **annotation:** Add Entity and Case searches. ([94c8f857](https://github.com/NCI-GDC/portal-ui/commit/94c8f857), closes [OICR-1053](https://jira.opensciencedatacloud.org/browse/OICR-1053))
* **annotations:** add notes as hidden tbl field ([a4c64093](https://github.com/NCI-GDC/portal-ui/commit/a4c64093), closes [OICR-811](https://jira.opensciencedatacloud.org/browse/OICR-811))
* **app:**
  * update styles ([975e8c68](https://github.com/NCI-GDC/portal-ui/commit/975e8c68))
  * pagination heading control ([f3c9566b](https://github.com/NCI-GDC/portal-ui/commit/f3c9566b), closes [OICR-810](https://jira.opensciencedatacloud.org/browse/OICR-810))
  * use expand param ([c27cefdc](https://github.com/NCI-GDC/portal-ui/commit/c27cefdc), closes [OICR-659](https://jira.opensciencedatacloud.org/browse/OICR-659))
* **auth:** Implement proper logout. ([208eba18](https://github.com/NCI-GDC/portal-ui/commit/208eba18))
* **cart:**
  * merge tabs, rename btns, clickable pie ([a62a2c5b](https://github.com/NCI-GDC/portal-ui/commit/a62a2c5b), closes [OICR-808](https://jira.opensciencedatacloud.org/browse/OICR-808))
  * Pie chart clicks change state. ([6d1790f8](https://github.com/NCI-GDC/portal-ui/commit/6d1790f8), closes [OICR-700](https://jira.opensciencedatacloud.org/browse/OICR-700))
  * Cart page uses table directive. ([3791a80b](https://github.com/NCI-GDC/portal-ui/commit/3791a80b), closes [OICR-668](https://jira.opensciencedatacloud.org/browse/OICR-668))
* **cart-directives:** remove frm cart in dropdown ([31a69526](https://github.com/NCI-GDC/portal-ui/commit/31a69526), closes [OICR-900](https://jira.opensciencedatacloud.org/browse/OICR-900))
* **case:** add cart button ([43f8e825](https://github.com/NCI-GDC/portal-ui/commit/43f8e825), closes [OICR-965](https://jira.opensciencedatacloud.org/browse/OICR-965))
* **charts:** Legend on hover ([c1408023](https://github.com/NCI-GDC/portal-ui/commit/c1408023))
* **export-tables:** flatten, discard parent keys ([35b74bb2](https://github.com/NCI-GDC/portal-ui/commit/35b74bb2), closes [OICR-990](https://jira.opensciencedatacloud.org/browse/OICR-990))
* **facets:** date and input range facets ([ed90b5d5](https://github.com/NCI-GDC/portal-ui/commit/ed90b5d5), closes [OICR-694](https://jira.opensciencedatacloud.org/browse/OICR-694), [OICR-699](https://jira.opensciencedatacloud.org/browse/OICR-699))
* **file:** show download modals for related files ([9c861def](https://github.com/NCI-GDC/portal-ui/commit/9c861def), closes [OICR-975](https://jira.opensciencedatacloud.org/browse/OICR-975))
* **fql:** more info in error msg ([2430bb8a](https://github.com/NCI-GDC/portal-ui/commit/2430bb8a), closes [OICR-949](https://jira.opensciencedatacloud.org/browse/OICR-949))
* **githut:**
  * link file count not size ([92b29c0c](https://github.com/NCI-GDC/portal-ui/commit/92b29c0c), closes [OICR-698](https://jira.opensciencedatacloud.org/browse/OICR-698))
  * tooltip of project name on proj id ([a4258a5f](https://github.com/NCI-GDC/portal-ui/commit/a4258a5f), closes [OICR-475](https://jira.opensciencedatacloud.org/browse/OICR-475))
  * tooltip for data types ([73c46ad8](https://github.com/NCI-GDC/portal-ui/commit/73c46ad8), closes [OICR-495](https://jira.opensciencedatacloud.org/browse/OICR-495))
  * Highlight all related lines. ([d6334164](https://github.com/NCI-GDC/portal-ui/commit/d6334164), closes [OICR-548](https://jira.opensciencedatacloud.org/browse/OICR-548))
  * Dynamic resizing. ([9000eaef](https://github.com/NCI-GDC/portal-ui/commit/9000eaef), closes [OICR-677](https://jira.opensciencedatacloud.org/browse/OICR-677))
* **gql:**
  * adds scroll to dropdown ([29f98823](https://github.com/NCI-GDC/portal-ui/commit/29f98823), closes [OICR-987](https://jira.opensciencedatacloud.org/browse/OICR-987))
  * update gql error report ([274b86f7](https://github.com/NCI-GDC/portal-ui/commit/274b86f7))
  * parens and unquoted vals ([10215752](https://github.com/NCI-GDC/portal-ui/commit/10215752))
  * adds autocomplete ([37f5baa9](https://github.com/NCI-GDC/portal-ui/commit/37f5baa9))
* **login:**
  * 	- Add Restangular service for auth 	- Use Auth Restangular for token and login ([9c00533f](https://github.com/NCI-GDC/portal-ui/commit/9c00533f))
  * don't read $cookie[x-auth-token] ([25aee1c4](https://github.com/NCI-GDC/portal-ui/commit/25aee1c4), closes [OICR-670](https://jira.opensciencedatacloud.org/browse/OICR-670))
* **pc:** bar click ([6d20f3df](https://github.com/NCI-GDC/portal-ui/commit/6d20f3df))
* **project:** Add annotations count to project. ([beecfa7d](https://github.com/NCI-GDC/portal-ui/commit/beecfa7d), closes [OICR-644](https://jira.opensciencedatacloud.org/browse/OICR-644))
* **projects:**
  * Case Count is clickable to project ([13adb164](https://github.com/NCI-GDC/portal-ui/commit/13adb164), closes [OICR-861](https://jira.opensciencedatacloud.org/browse/OICR-861))
  * add id and disease type to sort ([27b849e6](https://github.com/NCI-GDC/portal-ui/commit/27b849e6), closes [OICR-722](https://jira.opensciencedatacloud.org/browse/OICR-722))
  * Add tooltip for name to code. ([e492bb06](https://github.com/NCI-GDC/portal-ui/commit/e492bb06), closes [OICR-664](https://jira.opensciencedatacloud.org/browse/OICR-664))
  * summary tab ([329f744c](https://github.com/NCI-GDC/portal-ui/commit/329f744c), closes [OICR-666](https://jira.opensciencedatacloud.org/browse/OICR-666))
  * Column data sorting functionality. ([79c572a2](https://github.com/NCI-GDC/portal-ui/commit/79c572a2), closes [OICR-651](https://jira.opensciencedatacloud.org/browse/OICR-651))
* **quick:**
  * remove details on mobile views ([177c9428](https://github.com/NCI-GDC/portal-ui/commit/177c9428), closes [OICR-935](https://jira.opensciencedatacloud.org/browse/OICR-935))
  * update UI ([26f36148](https://github.com/NCI-GDC/portal-ui/commit/26f36148))
* **range-facets:** display barchart ontop of range facets ([1e1af03b](https://github.com/NCI-GDC/portal-ui/commit/1e1af03b), closes [OICR-853](https://jira.opensciencedatacloud.org/browse/OICR-853))
* **reports:** hook up reports ([9b9c2dda](https://github.com/NCI-GDC/portal-ui/commit/9b9c2dda), closes [OICR-891](https://jira.opensciencedatacloud.org/browse/OICR-891))
* **search:**
  * Add submitter_id as hidden field ([2ce73505](https://github.com/NCI-GDC/portal-ui/commit/2ce73505), closes [OICR-1041](https://jira.opensciencedatacloud.org/browse/OICR-1041))
  * Create summary card w/ tables. ([7c1d8712](https://github.com/NCI-GDC/portal-ui/commit/7c1d8712), closes [OICR-852](https://jira.opensciencedatacloud.org/browse/OICR-852))
  * UI Updates for Data page. ([3629723e](https://github.com/NCI-GDC/portal-ui/commit/3629723e), closes [OICR-807](https://jira.opensciencedatacloud.org/browse/OICR-807))
  * Charts navigate to file tab filtered ([da5e1878](https://github.com/NCI-GDC/portal-ui/commit/da5e1878), closes [OICR-776](https://jira.opensciencedatacloud.org/browse/OICR-776))
  * Quick Search prototype ([1ce98acd](https://github.com/NCI-GDC/portal-ui/commit/1ce98acd), closes [OICR-702](https://jira.opensciencedatacloud.org/browse/OICR-702))
  * Better search page performance. ([075180de](https://github.com/NCI-GDC/portal-ui/commit/075180de), closes [OICR-692](https://jira.opensciencedatacloud.org/browse/OICR-692))
  * UI updates for search summary views. ([f5e29d18](https://github.com/NCI-GDC/portal-ui/commit/f5e29d18), closes [OICR-687](https://jira.opensciencedatacloud.org/browse/OICR-687))
  * add tags as regular terms facet ([bc03e480](https://github.com/NCI-GDC/portal-ui/commit/bc03e480))
  * summary click ([b7c70b0d](https://github.com/NCI-GDC/portal-ui/commit/b7c70b0d))
* **summary:** Add clear active filters button. ([721b1d10](https://github.com/NCI-GDC/portal-ui/commit/721b1d10), closes [OICR-944](https://jira.opensciencedatacloud.org/browse/OICR-944))
* **table:**
  * adds tooltips to icons ([e897aac5](https://github.com/NCI-GDC/portal-ui/commit/e897aac5))
  * adds table tooltips ([ffb2fa6d](https://github.com/NCI-GDC/portal-ui/commit/ffb2fa6d))
* **tableicious:** Client side data support. ([19008f9c](https://github.com/NCI-GDC/portal-ui/commit/19008f9c), closes [OICR-669](https://jira.opensciencedatacloud.org/browse/OICR-669))
* **tbls:**
  * presist tableicious sort/arrange config ([f62306b6](https://github.com/NCI-GDC/portal-ui/commit/f62306b6), closes [OICR-705](https://jira.opensciencedatacloud.org/browse/OICR-705))
  * tooltips on datatypes ([90826f4a](https://github.com/NCI-GDC/portal-ui/commit/90826f4a), closes [OICR-696](https://jira.opensciencedatacloud.org/browse/OICR-696))


<a name"0.2.13-spr6"></a>
### 0.2.13-spr6 (2015-07-06)


#### Bug Fixes

* **cart:** pie charts updated to summary card ([aff638b9](https://github.com/NCI-GDC/portal-ui/commit/aff638b9))
* **export-tbl:** close modal properly ([a72a1964](https://github.com/NCI-GDC/portal-ui/commit/a72a1964), closes [OICR-955](https://jira.opensciencedatacloud.org/browse/OICR-955))
* **gql:**
  * auto-insert [ if missing ([75d6b415](https://github.com/NCI-GDC/portal-ui/commit/75d6b415), closes [OICR-925](https://jira.opensciencedatacloud.org/browse/OICR-925))
  * mouse selects correct item ([da127155](https://github.com/NCI-GDC/portal-ui/commit/da127155))
* **participant:** correct sref to 1 annotation ([a936822d](https://github.com/NCI-GDC/portal-ui/commit/a936822d))
* **search:** Maintain bolded case in matched terms ([8c7e146f](https://github.com/NCI-GDC/portal-ui/commit/8c7e146f))
* **summary-card:** needs graph for some reason ([8f0e30c1](https://github.com/NCI-GDC/portal-ui/commit/8f0e30c1))


#### Features

* **case:** add cart button ([43f8e825](https://github.com/NCI-GDC/portal-ui/commit/43f8e825), closes [OICR-965](https://jira.opensciencedatacloud.org/browse/OICR-965))
* **export-tables:** flatten, discard parent keys ([35b74bb2](https://github.com/NCI-GDC/portal-ui/commit/35b74bb2), closes [OICR-990](https://jira.opensciencedatacloud.org/browse/OICR-990))
* **gql:** adds scroll to dropdown ([29f98823](https://github.com/NCI-GDC/portal-ui/commit/29f98823), closes [OICR-987](https://jira.opensciencedatacloud.org/browse/OICR-987))
* **login:** 	- Add Restangular service for auth 	- Use Auth Restangular for token and login ([9c00533f](https://github.com/NCI-GDC/portal-ui/commit/9c00533f))
* **range-facets:** display barchart ontop of range facets ([1e1af03b](https://github.com/NCI-GDC/portal-ui/commit/1e1af03b), closes [OICR-853](https://jira.opensciencedatacloud.org/browse/OICR-853))
* **reports:** hook up reports ([9b9c2dda](https://github.com/NCI-GDC/portal-ui/commit/9b9c2dda), closes [OICR-891](https://jira.opensciencedatacloud.org/browse/OICR-891))


<a name"0.2.13-spr4"></a>
### 0.2.13-spr4 (2015-06-12)


#### Bug Fixes

* **add-to-cart:** use gettext getPlural for msgs ([501dfaeb](https://github.com/NCI-GDC/portal-ui/commit/501dfaeb), closes [OICR-927](https://jira.opensciencedatacloud.org/browse/OICR-927))
* **app:**
  * Ensure all models remove backdrop. ([f019c4f1](https://github.com/NCI-GDC/portal-ui/commit/f019c4f1), closes [OICR-938](https://jira.opensciencedatacloud.org/browse/OICR-938))
  * Fix random infinite loops ([bbba42f9](https://github.com/NCI-GDC/portal-ui/commit/bbba42f9))
* **auth:** Fix token download. ([120a1237](https://github.com/NCI-GDC/portal-ui/commit/120a1237), closes [OICR-743](https://jira.opensciencedatacloud.org/browse/OICR-743))
* **build:** Fix production builds ([cca3a9e6](https://github.com/NCI-GDC/portal-ui/commit/cca3a9e6))
* **cart:**
  * add filtered works with gql ([c5df14ed](https://github.com/NCI-GDC/portal-ui/commit/c5df14ed), closes [OICR-918](https://jira.opensciencedatacloud.org/browse/OICR-918))
  * correct case count ([c8f13ccf](https://github.com/NCI-GDC/portal-ui/commit/c8f13ccf), closes [OICR-894](https://jira.opensciencedatacloud.org/browse/OICR-894))
  * speed up add all to cart ([b10e16c6](https://github.com/NCI-GDC/portal-ui/commit/b10e16c6), closes [OICR-886](https://jira.opensciencedatacloud.org/browse/OICR-886))
  * Don't apply myproject filter for chart. ([e8b1474b](https://github.com/NCI-GDC/portal-ui/commit/e8b1474b), closes [OICR-881](https://jira.opensciencedatacloud.org/browse/OICR-881))
  * ui updates ([9a909383](https://github.com/NCI-GDC/portal-ui/commit/9a909383), closes [OICR-883](https://jira.opensciencedatacloud.org/browse/OICR-883))
  * cart item project id label ([4b23990e](https://github.com/NCI-GDC/portal-ui/commit/4b23990e), closes [OICR-870](https://jira.opensciencedatacloud.org/browse/OICR-870))
  * don't rename project_id to id ([6415191f](https://github.com/NCI-GDC/portal-ui/commit/6415191f))
  * update my projects col ([5e0dba20](https://github.com/NCI-GDC/portal-ui/commit/5e0dba20))
  * renames remove cart tooltip. ([065156a7](https://github.com/NCI-GDC/portal-ui/commit/065156a7), closes [OICR-856](https://jira.opensciencedatacloud.org/browse/OICR-856))
  * download button ([098df6e9](https://github.com/NCI-GDC/portal-ui/commit/098df6e9), closes [OICR-824](https://jira.opensciencedatacloud.org/browse/OICR-824))
  * fixes cart actions ([c0bb48a8](https://github.com/NCI-GDC/portal-ui/commit/c0bb48a8))
  * rm lzcompress from cart, too slow ([5d39d070](https://github.com/NCI-GDC/portal-ui/commit/5d39d070), closes [OICR-737](https://jira.opensciencedatacloud.org/browse/OICR-737))
  * Use proper directive for login. ([1219e89c](https://github.com/NCI-GDC/portal-ui/commit/1219e89c), closes [OICR-741](https://jira.opensciencedatacloud.org/browse/OICR-741))
  * Retrieve files before decompress ([82cf62c8](https://github.com/NCI-GDC/portal-ui/commit/82cf62c8))
* **cart-graphs:** authorization instead of access ([0f148edc](https://github.com/NCI-GDC/portal-ui/commit/0f148edc), closes [OICR-879](https://jira.opensciencedatacloud.org/browse/OICR-879))
* **chart:**
  * stop click on chart in query ([96c3d36e](https://github.com/NCI-GDC/portal-ui/commit/96c3d36e), closes [OICR-953](https://jira.opensciencedatacloud.org/browse/OICR-953))
  * Ensure chart data is always sorted. ([87b4f17b](https://github.com/NCI-GDC/portal-ui/commit/87b4f17b), closes [OICR-890](https://jira.opensciencedatacloud.org/browse/OICR-890))
* **charts:** Ignore resize when not rendered. ([1c475570](https://github.com/NCI-GDC/portal-ui/commit/1c475570), closes [OICR-842](https://jira.opensciencedatacloud.org/browse/OICR-842))
* **config:** Move to a simpler config ([04c74e47](https://github.com/NCI-GDC/portal-ui/commit/04c74e47))
* **download:**
  * 1 file -> GET & related_files flag ([6dcb1a8d](https://github.com/NCI-GDC/portal-ui/commit/6dcb1a8d), closes [OICR-888](https://jira.opensciencedatacloud.org/browse/OICR-888))
  * send credentials ([244e413a](https://github.com/NCI-GDC/portal-ui/commit/244e413a))
* **export:** export non hidden fields ([f72155d7](https://github.com/NCI-GDC/portal-ui/commit/f72155d7), closes [OICR-875](https://jira.opensciencedatacloud.org/browse/OICR-875))
* **facets:**
  * Fix flow issue on smaller screens. ([f0851393](https://github.com/NCI-GDC/portal-ui/commit/f0851393), closes [OICR-863](https://jira.opensciencedatacloud.org/browse/OICR-863))
  * project.name -> disease_type ([e893d286](https://github.com/NCI-GDC/portal-ui/commit/e893d286), closes [OICR-815](https://jira.opensciencedatacloud.org/browse/OICR-815))
* **file:**
  * don't overlap when resize ([1d1c5aea](https://github.com/NCI-GDC/portal-ui/commit/1d1c5aea), closes [OICR-939](https://jira.opensciencedatacloud.org/browse/OICR-939))
  * Properly show assoc entity annotations. ([aab4f423](https://github.com/NCI-GDC/portal-ui/commit/aab4f423), closes [OICR-679](https://jira.opensciencedatacloud.org/browse/OICR-679))
* **files:** Size filter handles undefined val. ([0509a52f](https://github.com/NCI-GDC/portal-ui/commit/0509a52f), closes [OICR-835](https://jira.opensciencedatacloud.org/browse/OICR-835))
* **githut:** hide tooltip on click ([33bd9f18](https://github.com/NCI-GDC/portal-ui/commit/33bd9f18), closes [OICR-827](https://jira.opensciencedatacloud.org/browse/OICR-827))
* **githut-graph:** 0 not clickable ([93bf8c84](https://github.com/NCI-GDC/portal-ui/commit/93bf8c84), closes [OICR-897](https://jira.opensciencedatacloud.org/browse/OICR-897))
* **gql:**
  * updates error message ([83ce2223](https://github.com/NCI-GDC/portal-ui/commit/83ce2223), closes [OICR-946](https://jira.opensciencedatacloud.org/browse/OICR-946))
  * always start dd selection at top ([e733f022](https://github.com/NCI-GDC/portal-ui/commit/e733f022), closes [OICR-947](https://jira.opensciencedatacloud.org/browse/OICR-947))
  * better handling of default input with AS ([60bf0c96](https://github.com/NCI-GDC/portal-ui/commit/60bf0c96), closes [OICR-941](https://jira.opensciencedatacloud.org/browse/OICR-941))
  * better handling of trailing val in list ([b2d93bcc](https://github.com/NCI-GDC/portal-ui/commit/b2d93bcc), closes [OICR-940](https://jira.opensciencedatacloud.org/browse/OICR-940))
  * removes trailing value in list using AS ([0ede9274](https://github.com/NCI-GDC/portal-ui/commit/0ede9274), closes [OICR-928](https://jira.opensciencedatacloud.org/browse/OICR-928))
  * handle NOT IN in query and auto suggest ([4a639a1f](https://github.com/NCI-GDC/portal-ui/commit/4a639a1f), closes [OICR-926](https://jira.opensciencedatacloud.org/browse/OICR-926))
  * automatically add [ to list auto suggest ([ac52db7a](https://github.com/NCI-GDC/portal-ui/commit/ac52db7a), closes [OICR-925](https://jira.opensciencedatacloud.org/browse/OICR-925))
  * handles numbers in auto suggest ([bc86e48f](https://github.com/NCI-GDC/portal-ui/commit/bc86e48f), closes [OICR-910](https://jira.opensciencedatacloud.org/browse/OICR-910))
  * removes _missing from suggest ([aa9ead6e](https://github.com/NCI-GDC/portal-ui/commit/aa9ead6e), closes [OICR-916](https://jira.opensciencedatacloud.org/browse/OICR-916))
  * adds autosuggest support for missing ([5c2640ae](https://github.com/NCI-GDC/portal-ui/commit/5c2640ae), closes [OICR-912](https://jira.opensciencedatacloud.org/browse/OICR-912))
  * remove old value ([e89845af](https://github.com/NCI-GDC/portal-ui/commit/e89845af), closes [OICR-911](https://jira.opensciencedatacloud.org/browse/OICR-911))
  * removes second auto suggest on space ([2212e5de](https://github.com/NCI-GDC/portal-ui/commit/2212e5de), closes [OICR-898](https://jira.opensciencedatacloud.org/browse/OICR-898))
* **header:** Don't use dropdown on xs view. ([dd3cef5a](https://github.com/NCI-GDC/portal-ui/commit/dd3cef5a), closes [OICR-744](https://jira.opensciencedatacloud.org/browse/OICR-744))
* **ie:** Remove usage of const. ([a1d6efd5](https://github.com/NCI-GDC/portal-ui/commit/a1d6efd5), closes [OICR-838](https://jira.opensciencedatacloud.org/browse/OICR-838), [OICR-805](https://jira.opensciencedatacloud.org/browse/OICR-805))
* **participant:**
  * Don't expand default sample. ([c0ec6998](https://github.com/NCI-GDC/portal-ui/commit/c0ec6998), closes [OICR-943](https://jira.opensciencedatacloud.org/browse/OICR-943))
  * Make TARGET data accessible. ([e9250bb1](https://github.com/NCI-GDC/portal-ui/commit/e9250bb1), closes [OICR-826](https://jira.opensciencedatacloud.org/browse/OICR-826))
* **query:**
  * switch case and files tab order ([800d6df5](https://github.com/NCI-GDC/portal-ui/commit/800d6df5), closes [OICR-909](https://jira.opensciencedatacloud.org/browse/OICR-909))
  * Ensure summary graphs load. ([3675cb41](https://github.com/NCI-GDC/portal-ui/commit/3675cb41), closes [OICR-908](https://jira.opensciencedatacloud.org/browse/OICR-908))
  * fixes range queries ([37376e71](https://github.com/NCI-GDC/portal-ui/commit/37376e71), closes [OICR-820](https://jira.opensciencedatacloud.org/browse/OICR-820))
  * fixes summary tab ([946b0408](https://github.com/NCI-GDC/portal-ui/commit/946b0408))
  * Fix tab loading. ([ee1c0dc9](https://github.com/NCI-GDC/portal-ui/commit/ee1c0dc9))
* **quick:** Ensure modal backdrop disappears. ([05354be6](https://github.com/NCI-GDC/portal-ui/commit/05354be6), closes [OICR-921](https://jira.opensciencedatacloud.org/browse/OICR-921), [OICR-907](https://jira.opensciencedatacloud.org/browse/OICR-907))
* **range:** min and max issues ([839cb8ce](https://github.com/NCI-GDC/portal-ui/commit/839cb8ce), closes [OICR-829](https://jira.opensciencedatacloud.org/browse/OICR-829), [OICR-804](https://jira.opensciencedatacloud.org/browse/OICR-804))
* **range-facet:** fix n undefined error ([0f05aa22](https://github.com/NCI-GDC/portal-ui/commit/0f05aa22))
* **range-ui:** only allow num & don't show weeks ([93f06756](https://github.com/NCI-GDC/portal-ui/commit/93f06756))
* **search:**
  * Ensure facet selections always update ([0d141b76](https://github.com/NCI-GDC/portal-ui/commit/0d141b76), closes [OICR-882](https://jira.opensciencedatacloud.org/browse/OICR-882))
  * fix access pie click ([97c5a5e2](https://github.com/NCI-GDC/portal-ui/commit/97c5a5e2), closes [OICR-887](https://jira.opensciencedatacloud.org/browse/OICR-887))
  * Case insensitive term match/highlight ([9bc4ded6](https://github.com/NCI-GDC/portal-ui/commit/9bc4ded6))
  * Close modal if on that entity page. ([96053443](https://github.com/NCI-GDC/portal-ui/commit/96053443), closes [OICR-854](https://jira.opensciencedatacloud.org/browse/OICR-854))
  * Cases loading is much quicker. ([54b3e22d](https://github.com/NCI-GDC/portal-ui/commit/54b3e22d), closes [OICR-831](https://jira.opensciencedatacloud.org/browse/OICR-831))
  * Fix matched term highlighting ([d928cbe3](https://github.com/NCI-GDC/portal-ui/commit/d928cbe3))
  * Reduce spacing on action buttons. ([195cc91a](https://github.com/NCI-GDC/portal-ui/commit/195cc91a), closes [OICR-795](https://jira.opensciencedatacloud.org/browse/OICR-795))
  * Remove all files button working. ([a119aa3c](https://github.com/NCI-GDC/portal-ui/commit/a119aa3c), closes [OICR-797](https://jira.opensciencedatacloud.org/browse/OICR-797))
* **summary:**
  * Add UI for no results in cards. ([ce96782a](https://github.com/NCI-GDC/portal-ui/commit/ce96782a), closes [OICR-892](https://jira.opensciencedatacloud.org/browse/OICR-892))
  * Apply my projects filters. ([9085c148](https://github.com/NCI-GDC/portal-ui/commit/9085c148), closes [OICR-866](https://jira.opensciencedatacloud.org/browse/OICR-866))
* **table:**
  * fixes empty pagination ([12fbfc00](https://github.com/NCI-GDC/portal-ui/commit/12fbfc00), closes [OICR-914](https://jira.opensciencedatacloud.org/browse/OICR-914))
  * save table sort settings ([5361cd9a](https://github.com/NCI-GDC/portal-ui/commit/5361cd9a), closes [OICR-873](https://jira.opensciencedatacloud.org/browse/OICR-873))
* **tableicious:**
  * table not respecting LS ([7eace6c8](https://github.com/NCI-GDC/portal-ui/commit/7eace6c8))
  * autorefresh inactive headers ([863b64dc](https://github.com/NCI-GDC/portal-ui/commit/863b64dc))
* **tables:** Fix export functionality ([963490fe](https://github.com/NCI-GDC/portal-ui/commit/963490fe))
* **token:** Fix token downloading. ([d8f6ade4](https://github.com/NCI-GDC/portal-ui/commit/d8f6ade4), closes [OICR-743](https://jira.opensciencedatacloud.org/browse/OICR-743))
* **user:** fixes file project check ([c033946f](https://github.com/NCI-GDC/portal-ui/commit/c033946f))


#### Features

* **add-to-cart:** show adding toast after 1s ([ec8eeee5](https://github.com/NCI-GDC/portal-ui/commit/ec8eeee5), closes [OICR-860](https://jira.opensciencedatacloud.org/browse/OICR-860))
* **annotations:** add notes as hidden tbl field ([a4c64093](https://github.com/NCI-GDC/portal-ui/commit/a4c64093), closes [OICR-811](https://jira.opensciencedatacloud.org/browse/OICR-811))
* **app:** pagination heading control ([f3c9566b](https://github.com/NCI-GDC/portal-ui/commit/f3c9566b), closes [OICR-810](https://jira.opensciencedatacloud.org/browse/OICR-810))
* **cart:** merge tabs, rename btns, clickable pie ([a62a2c5b](https://github.com/NCI-GDC/portal-ui/commit/a62a2c5b), closes [OICR-808](https://jira.opensciencedatacloud.org/browse/OICR-808))
* **cart-directives:** remove frm cart in dropdown ([31a69526](https://github.com/NCI-GDC/portal-ui/commit/31a69526), closes [OICR-900](https://jira.opensciencedatacloud.org/browse/OICR-900))
* **charts:** Legend on hover ([c1408023](https://github.com/NCI-GDC/portal-ui/commit/c1408023))
* **fql:** more info in error msg ([2430bb8a](https://github.com/NCI-GDC/portal-ui/commit/2430bb8a), closes [OICR-949](https://jira.opensciencedatacloud.org/browse/OICR-949))
* **gql:** update gql error report ([274b86f7](https://github.com/NCI-GDC/portal-ui/commit/274b86f7))
* **projects:** Case Count is clickable to project ([13adb164](https://github.com/NCI-GDC/portal-ui/commit/13adb164), closes [OICR-861](https://jira.opensciencedatacloud.org/browse/OICR-861))
* **quick:**
  * remove details on mobile views ([177c9428](https://github.com/NCI-GDC/portal-ui/commit/177c9428), closes [OICR-935](https://jira.opensciencedatacloud.org/browse/OICR-935))
  * update UI ([26f36148](https://github.com/NCI-GDC/portal-ui/commit/26f36148))
* **search:**
  * Create summary card w/ tables. ([7c1d8712](https://github.com/NCI-GDC/portal-ui/commit/7c1d8712), closes [OICR-852](https://jira.opensciencedatacloud.org/browse/OICR-852))
  * UI Updates for Data page. ([3629723e](https://github.com/NCI-GDC/portal-ui/commit/3629723e), closes [OICR-807](https://jira.opensciencedatacloud.org/browse/OICR-807))
  * Charts navigate to file tab filtered ([da5e1878](https://github.com/NCI-GDC/portal-ui/commit/da5e1878), closes [OICR-776](https://jira.opensciencedatacloud.org/browse/OICR-776))
  * Quick Search prototype ([1ce98acd](https://github.com/NCI-GDC/portal-ui/commit/1ce98acd), closes [OICR-702](https://jira.opensciencedatacloud.org/browse/OICR-702))
* **summary:** Add clear active filters button. ([721b1d10](https://github.com/NCI-GDC/portal-ui/commit/721b1d10), closes [OICR-944](https://jira.opensciencedatacloud.org/browse/OICR-944))
* **table:**
  * adds tooltips to icons ([e897aac5](https://github.com/NCI-GDC/portal-ui/commit/e897aac5))
  * adds table tooltips ([ffb2fa6d](https://github.com/NCI-GDC/portal-ui/commit/ffb2fa6d))


<a name"0.2.13-spr3"></a>
### 0.2.13-spr3 (2015-05-14)


#### Bug Fixes

* **facets:** autocomplete working again ([a94622a0](https://github.com/NCI-GDC/portal-ui/commit/a94622a0), closes [OICR-731](https://jira.opensciencedatacloud.org/browse/OICR-731))
* **tbls:** correctly arrange child headings again ([2ce5c4a6](https://github.com/NCI-GDC/portal-ui/commit/2ce5c4a6))


#### Features

* **facets:** date and input range facets ([ed90b5d5](https://github.com/NCI-GDC/portal-ui/commit/ed90b5d5), closes [OICR-694](https://jira.opensciencedatacloud.org/browse/OICR-694), [OICR-699](https://jira.opensciencedatacloud.org/browse/OICR-699))
* **gql:**
  * parens and unquoted vals ([10215752](https://github.com/NCI-GDC/portal-ui/commit/10215752))
  * adds autocomplete ([37f5baa9](https://github.com/NCI-GDC/portal-ui/commit/37f5baa9))
* **projects:** add id and disease type to sort ([27b849e6](https://github.com/NCI-GDC/portal-ui/commit/27b849e6), closes [OICR-722](https://jira.opensciencedatacloud.org/browse/OICR-722))


### 0.2.13-spr2 (2015-04-29)


#### Bug Fixes

* **annotation:** humanify center notification ([fa450691](https://github.com/NCI-GDC/portal-ui/commit/fa4506916749d67a50007488e90212172a06f3d1), closes [OICR-634](https://jira.opensciencedatacloud.org/browse/OICR-634))
* **app:**
  * Fix broken dropdown menus. ([65c1deb2](https://github.com/NCI-GDC/portal-ui/commit/65c1deb280fe4f2523cb0ad737ff52173df955eb))
  * Entity counts of 1 link direct to entity ([a5f76436](https://github.com/NCI-GDC/portal-ui/commit/a5f764360049d084038267b68a64970a83f5f294), closes [OICR-584](https://jira.opensciencedatacloud.org/browse/OICR-584))
* **auth:**
  * Cookies now on all API requests ([5b0228d3](https://github.com/NCI-GDC/portal-ui/commit/5b0228d3cd89b95a3169572ca41820150ac34c42))
  * Always pass auth token in headers. ([06b6bb0d](https://github.com/NCI-GDC/portal-ui/commit/06b6bb0dd6a7ca9baeb4a261f9a26a97697a849b))
* **build:** Prevent silent errors from LESS. ([1df4f1e0](https://github.com/NCI-GDC/portal-ui/commit/1df4f1e00d1cfcb79eeedf4bdf10f91e09b142b3))
* **cart:**
  * dropdown toggle working again ([5ad0df54](https://github.com/NCI-GDC/portal-ui/commit/5ad0df54b75ad9ffad3b763089919b0d8e543299))
  * update header ([3c9b0955](https://github.com/NCI-GDC/portal-ui/commit/3c9b0955ce68c4624f44a0831eb41302d482a9a6))
  * fix ([369c3b98](https://github.com/NCI-GDC/portal-ui/commit/369c3b981bd3205530d5232032c9ba7f4aaf06c9))
  * related_ids always defined ([b3c63ce3](https://github.com/NCI-GDC/portal-ui/commit/b3c63ce361c3cd69377b84f99a1a9cff405435ab), closes [OICR-646](https://jira.opensciencedatacloud.org/browse/OICR-646))
  * refactor cart ([acdf0f73](https://github.com/NCI-GDC/portal-ui/commit/acdf0f739959a2e49321d7304cb95adf8bf26a6e), closes [OICR-648](https://jira.opensciencedatacloud.org/browse/OICR-648), [OICR-652](https://jira.opensciencedatacloud.org/browse/OICR-652))
  * icons ([584fe142](https://github.com/NCI-GDC/portal-ui/commit/584fe14257111a0c8d923ba3143e96b076f9a57c))
  * fix chart update ([8b298101](https://github.com/NCI-GDC/portal-ui/commit/8b29810168789bc9fdb94ea91435ce1d8f35323d))
* **export:** Use FileSaver library for downloads. ([91be7013](https://github.com/NCI-GDC/portal-ui/commit/91be7013de40b0b9c61bcf7ff1045fbc8be48045), closes [OICR-540](https://jira.opensciencedatacloud.org/browse/OICR-540))
* **facets:** Prevent duplicate IDs being added. ([1ba2ded3](https://github.com/NCI-GDC/portal-ui/commit/1ba2ded3efb1d41e2f2c03f7fe0ac7319d7aef14), closes [OICR-707](https://jira.opensciencedatacloud.org/browse/OICR-707))
* **file:** Proper tag delimiter. ([daa9d041](https://github.com/NCI-GDC/portal-ui/commit/daa9d041212d40fa6ac0a6d2f3d70e0be69459f8), closes [OICR-642](https://jira.opensciencedatacloud.org/browse/OICR-642))
* **files:** Petabyte filtering. ([982d082d](https://github.com/NCI-GDC/portal-ui/commit/982d082d30c6df191dba7315b5c4ea1972e545c1), closes [OICR-577](https://jira.opensciencedatacloud.org/browse/OICR-577))
* **githut:** Text header overlapping. ([21ddb36e](https://github.com/NCI-GDC/portal-ui/commit/21ddb36e372649d0e0388c9b19f04f3df2e33e54), closes [OICR-676](https://jira.opensciencedatacloud.org/browse/OICR-676))
* **home:** update home link ([c1677f6e](https://github.com/NCI-GDC/portal-ui/commit/c1677f6e0c1099606a8cd4ce6d6bfdef1392f458))
* **login:**
  * Switches back to per request creds. ([40d35a42](https://github.com/NCI-GDC/portal-ui/commit/40d35a4274786777571e88bd7687aaa674993372))
  * Login didn't correctly pass headers. ([92d3ca09](https://github.com/NCI-GDC/portal-ui/commit/92d3ca09fdab947910ea1548df679f8f41dea1f6))
* **participant:** UI fixes for sample changes. ([4172ed4d](https://github.com/NCI-GDC/portal-ui/commit/4172ed4dfa441add8c0a8422c8ba2fbfae42dd10), closes [OICR-631](https://jira.opensciencedatacloud.org/browse/OICR-631))
* **pc:** advanced search fix ([ce7e20d8](https://github.com/NCI-GDC/portal-ui/commit/ce7e20d8e42c286919d2a988e9d295c428416dae))
* **projects:**
  * Hide pagination controls. ([7e874922](https://github.com/NCI-GDC/portal-ui/commit/7e874922fbcd92785e5f7c446d4ec43021096b94), closes [OICR-709](https://jira.opensciencedatacloud.org/browse/OICR-709))
  * expand .data_types and .exper_strat ([5a1b9e64](https://github.com/NCI-GDC/portal-ui/commit/5a1b9e642041a4948b33e0aa433f40ae9e3bcdaf), closes [OICR-686](https://jira.opensciencedatacloud.org/browse/OICR-686))
  * summary tab counts not calculating ([f3aa96c0](https://github.com/NCI-GDC/portal-ui/commit/f3aa96c00283cf25ac6c660b93fd2d8366435458), closes [OICR-684](https://jira.opensciencedatacloud.org/browse/OICR-684))
* **reports:** table header ([5ea190ca](https://github.com/NCI-GDC/portal-ui/commit/5ea190ca3b78061acf76ae35d2c8800d35d1979a))
* **reports-githut:** fix and add tooltiptext ([df37a7b3](https://github.com/NCI-GDC/portal-ui/commit/df37a7b34bd463f3635c7eabc0aac52d8b47b1ae), closes [OICR-708](https://jira.opensciencedatacloud.org/browse/OICR-708))
* **search:** Annotation columns right aligned. ([fe9fb987](https://github.com/NCI-GDC/portal-ui/commit/fe9fb9872d6e10200711ce942a037a514ccc6885))
* **tables:**
  * Fix failing sort tests ([63b93431](https://github.com/NCI-GDC/portal-ui/commit/63b93431df510b01e841790a8e1d2275bb6de020))
  * tableicious refactor ([25122ffc](https://github.com/NCI-GDC/portal-ui/commit/25122ffc107f18e5ccb9b30246e07bc5cf827b51))
* **user:** Icons in dropdown appear again. ([c73a05c3](https://github.com/NCI-GDC/portal-ui/commit/c73a05c3970a5fbae0a209234fb818417fc75b60), closes [OICR-649](https://jira.opensciencedatacloud.org/browse/OICR-649))


#### Features

* **app:** use expand param ([c27cefdc](https://github.com/NCI-GDC/portal-ui/commit/c27cefdceb00bff369b8177555619f4d92c9f0ff), closes [OICR-659](https://jira.opensciencedatacloud.org/browse/OICR-659))
* **auth:** Implement proper logout. ([208eba18](https://github.com/NCI-GDC/portal-ui/commit/208eba183097f4437f4b1f8938cdf2db7e2f519e))
* **cart:**
  * Pie chart clicks change state. ([6d1790f8](https://github.com/NCI-GDC/portal-ui/commit/6d1790f8588b56894a5333d05be5eb44fa3c2934), closes [OICR-700](https://jira.opensciencedatacloud.org/browse/OICR-700))
  * Cart page uses table directive. ([3791a80b](https://github.com/NCI-GDC/portal-ui/commit/3791a80b246ddd726ae06974a757f356984c88a3), closes [OICR-668](https://jira.opensciencedatacloud.org/browse/OICR-668))
* **githut:**
  * link file count not size ([92b29c0c](https://github.com/NCI-GDC/portal-ui/commit/92b29c0c94e7b8c7b4cfb812c163535462f1f62d), closes [OICR-698](https://jira.opensciencedatacloud.org/browse/OICR-698))
  * tooltip of project name on proj id ([a4258a5f](https://github.com/NCI-GDC/portal-ui/commit/a4258a5faf9453ca33088ff09a4614a8de10848f), closes [OICR-475](https://jira.opensciencedatacloud.org/browse/OICR-475))
  * tooltip for data types ([73c46ad8](https://github.com/NCI-GDC/portal-ui/commit/73c46ad890e92a4ce012eea42716499be351755e), closes [OICR-495](https://jira.opensciencedatacloud.org/browse/OICR-495))
  * Highlight all related lines. ([d6334164](https://github.com/NCI-GDC/portal-ui/commit/d6334164aff62aad25b04419d76bddbc7fd4319a), closes [OICR-548](https://jira.opensciencedatacloud.org/browse/OICR-548))
  * Dynamic resizing. ([9000eaef](https://github.com/NCI-GDC/portal-ui/commit/9000eaefbf72ae1b25d1e63816a3546b2dcc05a5), closes [OICR-677](https://jira.opensciencedatacloud.org/browse/OICR-677))
* **login:** don't read $cookie[x-auth-token] ([25aee1c4](https://github.com/NCI-GDC/portal-ui/commit/25aee1c4b87688f1339634838615fef34db67ef3), closes [OICR-670](https://jira.opensciencedatacloud.org/browse/OICR-670))
* **pc:** bar click ([6d20f3df](https://github.com/NCI-GDC/portal-ui/commit/6d20f3df098fd92e58c2e9beec9d4190f2c9a85e))
* **project:** Add annotations count to project. ([beecfa7d](https://github.com/NCI-GDC/portal-ui/commit/beecfa7d60d99b80afe2bcfef113b6b56bb40bd4), closes [OICR-644](https://jira.opensciencedatacloud.org/browse/OICR-644))
* **projects:**
  * Add tooltip for name to code. ([e492bb06](https://github.com/NCI-GDC/portal-ui/commit/e492bb0650d64ca3d6c13242e6608240d52ccf04), closes [OICR-664](https://jira.opensciencedatacloud.org/browse/OICR-664))
  * summary tab ([329f744c](https://github.com/NCI-GDC/portal-ui/commit/329f744c144be71d82605d2d24b1c178908d3ab7), closes [OICR-666](https://jira.opensciencedatacloud.org/browse/OICR-666))
  * Column data sorting functionality. ([79c572a2](https://github.com/NCI-GDC/portal-ui/commit/79c572a27508a844c8149665d9ce3560e02f4166), closes [OICR-651](https://jira.opensciencedatacloud.org/browse/OICR-651))
* **search:**
  * Better search page performance. ([075180de](https://github.com/NCI-GDC/portal-ui/commit/075180dea17a34c1d93996cfd963cfde0fb0e7e0), closes [OICR-692](https://jira.opensciencedatacloud.org/browse/OICR-692))
  * UI updates for search summary views. ([f5e29d18](https://github.com/NCI-GDC/portal-ui/commit/f5e29d182ae7b95955a802045e64b46d88d11388), closes [OICR-687](https://jira.opensciencedatacloud.org/browse/OICR-687))
  * add tags as regular terms facet ([bc03e480](https://github.com/NCI-GDC/portal-ui/commit/bc03e480798b11ccaa1cc47ea9258cf71c5a0cba))
  * summary click ([b7c70b0d](https://github.com/NCI-GDC/portal-ui/commit/b7c70b0d7641ee764af0d04d3470f058c8f6c74c))
* **tableicious:** Client side data support. ([19008f9c](https://github.com/NCI-GDC/portal-ui/commit/19008f9cebd02926aaf17f20295de8f0d6fe1104), closes [OICR-669](https://jira.opensciencedatacloud.org/browse/OICR-669))
* **tbls:**
  * presist tableicious sort/arrange config ([f62306b6](https://github.com/NCI-GDC/portal-ui/commit/f62306b6c1f65e914c811d031f1009ff1bd3f4ed), closes [OICR-705](https://jira.opensciencedatacloud.org/browse/OICR-705))
  * tooltips on datatypes ([90826f4a](https://github.com/NCI-GDC/portal-ui/commit/90826f4ac5143bcd63ffbabefdfe5723de917442), closes [OICR-696](https://jira.opensciencedatacloud.org/browse/OICR-696))


### 0.1.10 (2015-03-18)


#### Bug Fixes

* **annotation:**
  * get entity_submitter_id ([f6b37cfd](https://github.com/NCI-GDC/portal-ui/commit/f6b37cfd0e50b3f2a6f9b428775a688f92eb3bba), closes [OICR-558](https://jira.opensciencedatacloud.org/browse/OICR-558))
  * sumbitter_id->entity_submitter_id ([a73eedbb](https://github.com/NCI-GDC/portal-ui/commit/a73eedbb19d0dce2f43fa20dde1496d9e5c39502), closes [OICR-558](https://jira.opensciencedatacloud.org/browse/OICR-558))
  * annotations num on participant pg ([ad219fcb](https://github.com/NCI-GDC/portal-ui/commit/ad219fcb068693d573fabf17ce34c242fc789d76), closes [OICR-418](https://jira.opensciencedatacloud.org/browse/OICR-418))
  * correct project page link ([d486340a](https://github.com/NCI-GDC/portal-ui/commit/d486340ae2f2125889ec795b0c1d0ec939fadf1c), closes [OICR-490](https://jira.opensciencedatacloud.org/browse/OICR-490))
* **annotations:**
  * Apply my projects filters. ([c8dbc00f](https://github.com/NCI-GDC/portal-ui/commit/c8dbc00fb64cbb80ea41a0995d2caabd6a2eab59), closes [OICR-640](https://jira.opensciencedatacloud.org/browse/OICR-640))
  * Split up classification word. ([e38b7d4c](https://github.com/NCI-GDC/portal-ui/commit/e38b7d4ccf6d5bc3e450fc3777c9cad9f33f3712), closes [OICR-634](https://jira.opensciencedatacloud.org/browse/OICR-634))
  * updates ([ed5a3de2](https://github.com/NCI-GDC/portal-ui/commit/ed5a3de21fc5d23d7d06d7c04c1e86a5efe3968e))
  * Use project_id for facet. ([23659ed2](https://github.com/NCI-GDC/portal-ui/commit/23659ed2d655c86e547c8c7602c5789995fddf20), closes [OICR-573](https://jira.opensciencedatacloud.org/browse/OICR-573))
  * still display facets on back ([09c6f41a](https://github.com/NCI-GDC/portal-ui/commit/09c6f41ad422e0ea47bc83f2e94c346a7f9b2a8e), closes [OICR-557](https://jira.opensciencedatacloud.org/browse/OICR-557))
  * update field names ([616ff868](https://github.com/NCI-GDC/portal-ui/commit/616ff868500e0e47889de041cea0742d7820db09), closes [OICR-555](https://jira.opensciencedatacloud.org/browse/OICR-555), [OICR-484](https://jira.opensciencedatacloud.org/browse/OICR-484), [OICR-491](https://jira.opensciencedatacloud.org/browse/OICR-491), [OICR-535](https://jira.opensciencedatacloud.org/browse/OICR-535))
  * Fix participant link ([c6c45568](https://github.com/NCI-GDC/portal-ui/commit/c6c45568c18ce2311b78eb545d9c1ff172a7f885))
  * display project name in facet ([b311bcc4](https://github.com/NCI-GDC/portal-ui/commit/b311bcc4c8b6f296e9dbcb00aa57c8cdd83f5401), closes [OICR-519](https://jira.opensciencedatacloud.org/browse/OICR-519))
  * use participant_id ([b045c50e](https://github.com/NCI-GDC/portal-ui/commit/b045c50ee261134ab079e1afcf494c5756b3f835), closes [OICR-489](https://jira.opensciencedatacloud.org/browse/OICR-489))
  * show classification facet ([98c03a4b](https://github.com/NCI-GDC/portal-ui/commit/98c03a4b90a105a074fa6f2fab890844d4649a83), closes [OICR-488](https://jira.opensciencedatacloud.org/browse/OICR-488))
  * match fields ([aa4e723a](https://github.com/NCI-GDC/portal-ui/commit/aa4e723a1e4fc776f27c117484a85e64eb952c6e))
* **app:**
  * Update facets displayed/order. ([91a5d342](https://github.com/NCI-GDC/portal-ui/commit/91a5d34293978e24e68676b93f7d1e17cfa2c667), closes [OICR-610](https://jira.opensciencedatacloud.org/browse/OICR-610))
  * Remove columns in Cart and Files. ([c62330c8](https://github.com/NCI-GDC/portal-ui/commit/c62330c812c10ec5ba63efec88715bd3815c8656), closes [OICR-591](https://jira.opensciencedatacloud.org/browse/OICR-591))
  * Remove revision columns from pages. ([1449fdbe](https://github.com/NCI-GDC/portal-ui/commit/1449fdbed145fb304f0f9d813dc61b0776532c93), closes [OICR-595](https://jira.opensciencedatacloud.org/browse/OICR-595))
  * Prevent multiple menu items active. ([b6407bf8](https://github.com/NCI-GDC/portal-ui/commit/b6407bf80d6973a99405d2e82340c5ef6e4fc354), closes [OICR-568](https://jira.opensciencedatacloud.org/browse/OICR-568))
  * some typescript errors ([3e6bcdd4](https://github.com/NCI-GDC/portal-ui/commit/3e6bcdd48f960b4e54efa8cbe5de2732f5208ef8))
  * Hide sidebar nav small screens. ([56acaf36](https://github.com/NCI-GDC/portal-ui/commit/56acaf36d0ada24abd462765015eccd5c229eadd), closes [OICR-307](https://jira.opensciencedatacloud.org/browse/OICR-307))
  * fixes filter related bugs ([04f4d81b](https://github.com/NCI-GDC/portal-ui/commit/04f4d81b534e836a91f547e7b98eb903555f4246))
  * Status request needs to occur later. ([b6c538b6](https://github.com/NCI-GDC/portal-ui/commit/b6c538b679357c5ee995171e6592b14148ddfa83))
  * Fix model loading spinner. ([5dea5e4c](https://github.com/NCI-GDC/portal-ui/commit/5dea5e4cb0e8577200b81e36ad9e54e82138dd95))
* **cart:**
  * fix manifest not respecting selected ([5336ea78](https://github.com/NCI-GDC/portal-ui/commit/5336ea78d8c84595a773c7e0bb82cfb3ab43396a))
  * fix downloads not respecting selected ([309075f7](https://github.com/NCI-GDC/portal-ui/commit/309075f79646bb597f61ca6e92f2c5291a49e1d2))
  * fix popup counts ([d9dea729](https://github.com/NCI-GDC/portal-ui/commit/d9dea729edad055be8ed359638af6b33f81d000f))
  * works ([23d1a604](https://github.com/NCI-GDC/portal-ui/commit/23d1a6043b5985c47da2ebccb097a8f101de2178))
  * fix my project row ([bebb9dbf](https://github.com/NCI-GDC/portal-ui/commit/bebb9dbf310fc0b02e7528cd7a50dc544492ed41))
  * Fixes for cart ([db08ab48](https://github.com/NCI-GDC/portal-ui/commit/db08ab48799bb92e559ddb9ebab3330aac597c2a))
  * move dl manifest out of dropdown ([94fae86e](https://github.com/NCI-GDC/portal-ui/commit/94fae86e851d8f3b666e5f51eb6180e2599d5f2d), closes [OICR-603](https://jira.opensciencedatacloud.org/browse/OICR-603))
  * display files not added notification ([ca342ff7](https://github.com/NCI-GDC/portal-ui/commit/ca342ff7ea67f9fcdd4060012c34f1726598e739), closes [OICR-622](https://jira.opensciencedatacloud.org/browse/OICR-622))
  * remove dl metadata ([30134e5b](https://github.com/NCI-GDC/portal-ui/commit/30134e5bc7c71fda68eab907a9bbdd97bd21ac70), closes [OICR-583](https://jira.opensciencedatacloud.org/browse/OICR-583))
  * always show annotation length ([9c0fd797](https://github.com/NCI-GDC/portal-ui/commit/9c0fd797395ec5f1fe4246bb385becd67f02c8dc), closes [OICR-589](https://jira.opensciencedatacloud.org/browse/OICR-589))
  * fix add/remove from cart ([3fe4c3d5](https://github.com/NCI-GDC/portal-ui/commit/3fe4c3d5260dd383ea8529ea23337bbaf02dc256), closes [OICR-618](https://jira.opensciencedatacloud.org/browse/OICR-618))
  * hide cart chart on 0 items ([6e522a22](https://github.com/NCI-GDC/portal-ui/commit/6e522a225c38a8aed4d2fcf8a821a2cebe6bad75))
  * display missing fields ([099d5d1e](https://github.com/NCI-GDC/portal-ui/commit/099d5d1ed968cc43022ba7a8674a3583a1e4b6de), closes [OICR-457](https://jira.opensciencedatacloud.org/browse/OICR-457))
  * add all to cart uses my projects filter ([c720a8bf](https://github.com/NCI-GDC/portal-ui/commit/c720a8bfb8aaee8fc88a2fda8117c1967f030a37), closes [OICR-236](https://jira.opensciencedatacloud.org/browse/OICR-236))
  * ensure cart cols filled ([a54e3a2c](https://github.com/NCI-GDC/portal-ui/commit/a54e3a2cafccf24f2cd52470e837c28b1d2499a2), closes [OICR-245](https://jira.opensciencedatacloud.org/browse/OICR-245))
* **colors:** fix project list colors ([6d104ef3](https://github.com/NCI-GDC/portal-ui/commit/6d104ef3f2500309d7fd0b6c1a59a01d6dbfd4e8), closes [OICR-561](https://jira.opensciencedatacloud.org/browse/OICR-561))
* **dnd:** fixing reordering bug ([18dc1128](https://github.com/NCI-GDC/portal-ui/commit/18dc1128ff6feedb6afab708550d01c8b41c6e05), closes [OICR-316](https://jira.opensciencedatacloud.org/browse/OICR-316))
* **download:** add related_ids to download ([794daacd](https://github.com/NCI-GDC/portal-ui/commit/794daacd057288410e8be2b8a7294e8f8ce98259), closes [OICR-624](https://jira.opensciencedatacloud.org/browse/OICR-624))
* **entity:**
  * participant fixes ([0812193f](https://github.com/NCI-GDC/portal-ui/commit/0812193f2b10dedd6831430bbff58e76bf4c9a33), closes [OICR-596](https://jira.opensciencedatacloud.org/browse/OICR-596))
  * update language ([61b7e045](https://github.com/NCI-GDC/portal-ui/commit/61b7e0456c19dba20163f90e1f51e32a39c2fae9))
* **facets:** Consistent spacing for terms. ([7734cbc4](https://github.com/NCI-GDC/portal-ui/commit/7734cbc44caf7fe33c462aadb2c652203dba468f), closes [OICR-611](https://jira.opensciencedatacloud.org/browse/OICR-611))
* **file:**
  * Update associated entities. ([3acb7926](https://github.com/NCI-GDC/portal-ui/commit/3acb7926c52e047d02952aeec6661db092d13b22), closes [OICR-531](https://jira.opensciencedatacloud.org/browse/OICR-531))
  * add dl access modal ([70037cc7](https://github.com/NCI-GDC/portal-ui/commit/70037cc73c53ac3dd6329b65a961fe950a03cc59), closes [OICR-550](https://jira.opensciencedatacloud.org/browse/OICR-550))
  * set archiveCount to 0 when no archive ([96434f03](https://github.com/NCI-GDC/portal-ui/commit/96434f03a35a53f4fd98e9a700cf14e5b1aa858d), closes [OICR-525](https://jira.opensciencedatacloud.org/browse/OICR-525))
  * match mockup ([cf2d293b](https://github.com/NCI-GDC/portal-ui/commit/cf2d293b3f6b513341e28caf89c219a0e99013d3), closes [OICR-516](https://jira.opensciencedatacloud.org/browse/OICR-516))
  * find file same archive ([19ad64b4](https://github.com/NCI-GDC/portal-ui/commit/19ad64b4fa96f57f4ffd3432e2662bfca5665147), closes [OICR-485](https://jira.opensciencedatacloud.org/browse/OICR-485))
  * add to cart from file page ([3b7bf382](https://github.com/NCI-GDC/portal-ui/commit/3b7bf382f4ba1df2fad2b14d2fb8d9e0ce70bf32), closes [OICR-497](https://jira.opensciencedatacloud.org/browse/OICR-497))
  * related files type ([9c6a3b4c](https://github.com/NCI-GDC/portal-ui/commit/9c6a3b4c8ce041a94641830b1416cbd95de52da0))
  * fix file page exception ([2b050da9](https://github.com/NCI-GDC/portal-ui/commit/2b050da9266de7aae2636c215e35ff67e0997a30))
* **files:**
  * Track by entity_id over participant_id ([159a80df](https://github.com/NCI-GDC/portal-ui/commit/159a80df59a8cdf73862c795a4e33df5c1f4937a))
  * Show '00' remainder for all but Bytes. ([032a75d4](https://github.com/NCI-GDC/portal-ui/commit/032a75d4dfbbc3e5c949159dcd4bc643485fd08f), closes [OICR-577](https://jira.opensciencedatacloud.org/browse/OICR-577))
  * Properly linking to participants. ([00c9158f](https://github.com/NCI-GDC/portal-ui/commit/00c9158f16f50ca7b98f0d3530fd4bc05d230500), closes [OICR-605](https://jira.opensciencedatacloud.org/browse/OICR-605))
  * Trim trailing '00' from filter. ([48c31bb0](https://github.com/NCI-GDC/portal-ui/commit/48c31bb042aded8df054d8d10560c0093dc97244))
  * Update file size filter. ([a19e2f69](https://github.com/NCI-GDC/portal-ui/commit/a19e2f698b2e15b5835c649fcd9965127a6abc29), closes [OICR-577](https://jira.opensciencedatacloud.org/browse/OICR-577))
  * Updates for removed data. ([1c2faebe](https://github.com/NCI-GDC/portal-ui/commit/1c2faebee1d334dcd7b349dcf0fe0b90df53bfee), closes [OICR-530](https://jira.opensciencedatacloud.org/browse/OICR-530))
  * use files.origin ([9da26db2](https://github.com/NCI-GDC/portal-ui/commit/9da26db291e30cc8b1a5e3089f8f2b9f428c2c3b), closes [OICR-532](https://jira.opensciencedatacloud.org/browse/OICR-532))
* **filter:** correct lang ([0100e2e4](https://github.com/NCI-GDC/portal-ui/commit/0100e2e4e5b3836a8e2820a319e5b7ed62b3798a))
* **filters:** makes ?annotations=1 optional ([8f2ac17f](https://github.com/NCI-GDC/portal-ui/commit/8f2ac17f5de33c0798796fb276ce5a4da34bd712), closes [OICR-641](https://jira.opensciencedatacloud.org/browse/OICR-641))
* **footer:** footer fixes ([299ead23](https://github.com/NCI-GDC/portal-ui/commit/299ead23e4c8c4bcbb6850c250c8217c20984c91))
* **githut:**
  * fix project page ([6a74efd1](https://github.com/NCI-GDC/portal-ui/commit/6a74efd1bcdc511d493f907b5827a771fceb7254))
  * change project order ([164f7865](https://github.com/NCI-GDC/portal-ui/commit/164f7865eb2a402f18e1f935e0c680634a5a1c95))
* **gql:** suggest failing under certain conditions ([4f7de1e6](https://github.com/NCI-GDC/portal-ui/commit/4f7de1e692cc8f26dd6f0bc655f8db3bee7351cc), closes [OICR-559](https://jira.opensciencedatacloud.org/browse/OICR-559))
* **graph:** update title text ([f37927b8](https://github.com/NCI-GDC/portal-ui/commit/f37927b89069f56d4c3d1b48e6064031f2f9cfc6), closes [OICR-348](https://jira.opensciencedatacloud.org/browse/OICR-348))
* **login:**
  * Filter terms for projects. ([faf48e47](https://github.com/NCI-GDC/portal-ui/commit/faf48e47831c281c876d51f4b3c7fa8c3960a709), closes [OICR-542](https://jira.opensciencedatacloud.org/browse/OICR-542))
  * Updates for API changes. ([a1118777](https://github.com/NCI-GDC/portal-ui/commit/a11187778bffbc423be1e525f01032c1db3e3873), closes [OICR-542](https://jira.opensciencedatacloud.org/browse/OICR-542))
* **myprojects:** Don't hide facet when logged in. ([9259dcc5](https://github.com/NCI-GDC/portal-ui/commit/9259dcc59ae35a165d1d7894b5baff4e62d9c459), closes [OICR-639](https://jira.opensciencedatacloud.org/browse/OICR-639))
* **pagination:**
  * Fixes size selector. ([21b126e5](https://github.com/NCI-GDC/portal-ui/commit/21b126e59c80f0db1b17ce2afb0775bbf5fb5728), closes [OICR-492](https://jira.opensciencedatacloud.org/browse/OICR-492))
  * Fixes pagination total pages. ([308e921d](https://github.com/NCI-GDC/portal-ui/commit/308e921d0b353ad31451e73f811cbc586222c839), closes [OICR-238](https://jira.opensciencedatacloud.org/browse/OICR-238))
* **part:**
  * suppress error ([360f8160](https://github.com/NCI-GDC/portal-ui/commit/360f8160f5d4976fb44c1a12623afd079079e580), closes [OICR-554](https://jira.opensciencedatacloud.org/browse/OICR-554))
  * show filter files load ([934792a5](https://github.com/NCI-GDC/portal-ui/commit/934792a516d81c4387e0c792035011b63a4addb3))
* **participant:**
  * fix experimental strategies ([5e327ed9](https://github.com/NCI-GDC/portal-ui/commit/5e327ed9bb3b3a51bc754a339ad2d15485e590e9))
  * Biospecimen updates. ([355ea9c5](https://github.com/NCI-GDC/portal-ui/commit/355ea9c515927cb9954581424fcd8dd3a5dbd515))
  * Hide buttons when no file. ([37956139](https://github.com/NCI-GDC/portal-ui/commit/37956139f1ada80715bd12854cbff371b6571066), closes [OICR-614](https://jira.opensciencedatacloud.org/browse/OICR-614))
  * check if file found ([a02f693a](https://github.com/NCI-GDC/portal-ui/commit/a02f693a0b79df5608e29a31b462f8149182b0f7), closes [OICR-551](https://jira.opensciencedatacloud.org/browse/OICR-551))
  * Updates for Biospecimen. ([7761077c](https://github.com/NCI-GDC/portal-ui/commit/7761077c39d6f1d61bcdd557fe651390306b9692), closes [OICR-515](https://jira.opensciencedatacloud.org/browse/OICR-515))
  * use count tabl directive ([9395faaa](https://github.com/NCI-GDC/portal-ui/commit/9395faaa12fb777f3ba1f2f957c51755eabeb3f7), closes [OICR-512](https://jira.opensciencedatacloud.org/browse/OICR-512), [OICR-511](https://jira.opensciencedatacloud.org/browse/OICR-511))
  * search page links work ([d72e06ab](https://github.com/NCI-GDC/portal-ui/commit/d72e06ab9400668a64db5c7b4860eb2d4a491e63), closes [OICR-416](https://jira.opensciencedatacloud.org/browse/OICR-416))
  * dl biospecimen xml ([4dab658d](https://github.com/NCI-GDC/portal-ui/commit/4dab658d9ac15b16e758d701f0e758d4c5adc56f), closes [OICR-493](https://jira.opensciencedatacloud.org/browse/OICR-493))
  * expand all biospecimen ([1363d1dc](https://github.com/NCI-GDC/portal-ui/commit/1363d1dc5ce2d99673b9132daed8735fee88fdc8))
  * add project-name and program tbd ([77d95ac7](https://github.com/NCI-GDC/portal-ui/commit/77d95ac762df26455d01ea2882300e05266aca9c))
* **participants:**
  * avail. str. heading spacing ([e65fc88d](https://github.com/NCI-GDC/portal-ui/commit/e65fc88de4f175219c5cad1ccdfddf61426f4768), closes [OICR-469](https://jira.opensciencedatacloud.org/browse/OICR-469))
  * use diesease_type ([16b676f4](https://github.com/NCI-GDC/portal-ui/commit/16b676f42fd992dd2a4eee8635b4291ebde4b39c))
  * show annotation number ([9ac045e3](https://github.com/NCI-GDC/portal-ui/commit/9ac045e3fbcc243ad7525226ae9ef4f32fed2935), closes [OICR-418](https://jira.opensciencedatacloud.org/browse/OICR-418))
* **pc:**
  * hovering issue ([6280b654](https://github.com/NCI-GDC/portal-ui/commit/6280b6542da990e2a720b8c4b3cb0256c4087cd4), closes [OICR-613](https://jira.opensciencedatacloud.org/browse/OICR-613))
  * hover ([54158cc9](https://github.com/NCI-GDC/portal-ui/commit/54158cc92c30819bbb7d426d95e4d966cd235149))
  * prevent err ([f14c453f](https://github.com/NCI-GDC/portal-ui/commit/f14c453f50243950388ac3982b31d88b9958242d))
  * fix sorting ([042af187](https://github.com/NCI-GDC/portal-ui/commit/042af187ffbc53336ce001ae216527779e66197a))
  * number style ([61feec3a](https://github.com/NCI-GDC/portal-ui/commit/61feec3ac2703e3d8fba7ced21a981e6f8947b90))
  * fix overlap ([552b8516](https://github.com/NCI-GDC/portal-ui/commit/552b8516c649501f56b734e632f75fc7b8957b23))
  * no bold text ([676ed1c9](https://github.com/NCI-GDC/portal-ui/commit/676ed1c994204588c525fb6a57d1bc4d579baf11))
  * no select path ([2f21c2e4](https://github.com/NCI-GDC/portal-ui/commit/2f21c2e4001a85c39f56070062c1ac785d83db94))
  * fixes format and hover issues ([fd1621ef](https://github.com/NCI-GDC/portal-ui/commit/fd1621efb501e7b6b3e68d0b92c5b27dbcb6a39a), closes [OICR-339](https://jira.opensciencedatacloud.org/browse/OICR-339), [OICR-411](https://jira.opensciencedatacloud.org/browse/OICR-411), [OICR-388](https://jira.opensciencedatacloud.org/browse/OICR-388), [OICR-348](https://jira.opensciencedatacloud.org/browse/OICR-348))
* **pie:**
  * change behavoir ([7d090b63](https://github.com/NCI-GDC/portal-ui/commit/7d090b63fa2e589b1b5186af12ea324ba5be8e11))
  * update pie ([44a8f376](https://github.com/NCI-GDC/portal-ui/commit/44a8f37692b9b7cd69a05d8148ad0532e9d5229b), closes [OICR-566](https://jira.opensciencedatacloud.org/browse/OICR-566))
* **project:**
  * experimental strategy data ([918e1de0](https://github.com/NCI-GDC/portal-ui/commit/918e1de0fe8b8c2c49a14c5758f93d60f4d0dee0))
  * update available data ([42dded95](https://github.com/NCI-GDC/portal-ui/commit/42dded9532506d76be24ac9721b66d60275113c3))
  * add graph title ([4a6b17d6](https://github.com/NCI-GDC/portal-ui/commit/4a6b17d6be5302efa4c6f3abbe62cc3985faedc9))
* **projects:**
  * Fixes searching my project codes. ([ea78b357](https://github.com/NCI-GDC/portal-ui/commit/ea78b357c9a7a422df789f978dff1b4e2aad99b1), closes [OICR-567](https://jira.opensciencedatacloud.org/browse/OICR-567))
  * Prevent 0 counts being links. ([57c58dd6](https://github.com/NCI-GDC/portal-ui/commit/57c58dd662951923b65592aa3643fa3ea2136ffd))
  * Ensure table tab is defaulted. ([26bd423d](https://github.com/NCI-GDC/portal-ui/commit/26bd423d0bf797d6292e9b66007d5f50d85d1398), closes [OICR-510](https://jira.opensciencedatacloud.org/browse/OICR-510))
  * fixes pc sorting ([b41de43f](https://github.com/NCI-GDC/portal-ui/commit/b41de43f3378534c9b6bf265b215bf856466ab77), closes [OICR-464](https://jira.opensciencedatacloud.org/browse/OICR-464))
  * Fixes for Projects List. ([54e7f0fd](https://github.com/NCI-GDC/portal-ui/commit/54e7f0fd8252c813b16014520d4324d427dd7752), closes [OICR-420](https://jira.opensciencedatacloud.org/browse/OICR-420), [OICR-427](https://jira.opensciencedatacloud.org/browse/OICR-427), [OICR-474](https://jira.opensciencedatacloud.org/browse/OICR-474), [OICR-428](https://jira.opensciencedatacloud.org/browse/OICR-428), [OICR-422](https://jira.opensciencedatacloud.org/browse/OICR-422), [OICR-425](https://jira.opensciencedatacloud.org/browse/OICR-425))
  * exp strategy facet works again ([4bebe7b3](https://github.com/NCI-GDC/portal-ui/commit/4bebe7b344398cf9e6e865c03909f35ec97e1be1))
* **query:** Active sub view persists on switch. ([18561bdf](https://github.com/NCI-GDC/portal-ui/commit/18561bdf8aae2a2895446b3723562c8380b66645), closes [OICR-601](https://jira.opensciencedatacloud.org/browse/OICR-601))
* **report:**
  * report url hotfix ([9619bdf0](https://github.com/NCI-GDC/portal-ui/commit/9619bdf05217f17b3bf947a182fce18c9fc99b23))
  * update data types ([ec9b83bd](https://github.com/NCI-GDC/portal-ui/commit/ec9b83bd26bcbfcf74adaf7e809fc1dbf58bf11e))
* **reports:**
  * no nav ([e2fa37c1](https://github.com/NCI-GDC/portal-ui/commit/e2fa37c1dc559e148c0f5ea3c5cc1bbccf1d32d7))
  * data reports fixes ([5649c7c2](https://github.com/NCI-GDC/portal-ui/commit/5649c7c2fa2cd59a166bfe5d1a53d4f4a970dbca), closes [OICR-629](https://jira.opensciencedatacloud.org/browse/OICR-629), [OICR-630](https://jira.opensciencedatacloud.org/browse/OICR-630))
  * fix button ([0e13268e](https://github.com/NCI-GDC/portal-ui/commit/0e13268e3831132435a4709500175a990f69da51))
  * download report data ([4006be85](https://github.com/NCI-GDC/portal-ui/commit/4006be85403095f57197f6efc03418fa7e9a5838), closes [OICR-397](https://jira.opensciencedatacloud.org/browse/OICR-397), [OICR-463](https://jira.opensciencedatacloud.org/browse/OICR-463), [OICR-434](https://jira.opensciencedatacloud.org/browse/OICR-434))
  * various features and bugs ([7e7d563c](https://github.com/NCI-GDC/portal-ui/commit/7e7d563ce7ea270908ab67d3f3b4809dd4763080))
* **search:**
  * Update copy for participants. ([c69cfe53](https://github.com/NCI-GDC/portal-ui/commit/c69cfe53ec20a42a6a67a1d7cc0fa36060a47856), closes [OICR-579](https://jira.opensciencedatacloud.org/browse/OICR-579))
  * Remove GB from summary header. ([ff907fa7](https://github.com/NCI-GDC/portal-ui/commit/ff907fa76ba43cce3475f982f38db6f68533db9c), closes [OICR-576](https://jira.opensciencedatacloud.org/browse/OICR-576))
  * Files for participant linking. ([992dd704](https://github.com/NCI-GDC/portal-ui/commit/992dd70482d988e543b1483f48c7ade59ad25a6d), closes [OICR-571](https://jira.opensciencedatacloud.org/browse/OICR-571))
  * Update UI for add all to cart. ([1d36176e](https://github.com/NCI-GDC/portal-ui/commit/1d36176e3f40ec18b7bae944036d4add5f2254c6), closes [OICR-545](https://jira.opensciencedatacloud.org/browse/OICR-545))
  * Better fix for search files. ([b6602852](https://github.com/NCI-GDC/portal-ui/commit/b66028529e22de38186d84605c24b15dc72fb04d))
  * Fix compile for files. ([5e63e1fe](https://github.com/NCI-GDC/portal-ui/commit/5e63e1fef2aff7fceedf9131600369d863a1fe2c))
  * Table state links update. ([759d5d25](https://github.com/NCI-GDC/portal-ui/commit/759d5d255b54b0af285ac8dc5514e0cd25394da7))
  * Participant file count links ([cd3bf2d5](https://github.com/NCI-GDC/portal-ui/commit/cd3bf2d52dbbf8d8c8db8102683b1f5602160984))
  * Fixes for search page. ([fd1df6fa](https://github.com/NCI-GDC/portal-ui/commit/fd1df6fa19e04cdb523e9d9535139148dcdcc349), closes [OICR-443](https://jira.opensciencedatacloud.org/browse/OICR-443))
  * don't add removed facets on tabswitch ([f5ce5781](https://github.com/NCI-GDC/portal-ui/commit/f5ce57819ce7a43003d88d6779a7204b30f72210))
* **table:**
  * table icons ([b704ee8a](https://github.com/NCI-GDC/portal-ui/commit/b704ee8a9349f3b8eceb183814b74af55daff031))
  * fix title ([6bbb65fd](https://github.com/NCI-GDC/portal-ui/commit/6bbb65fda943a20f6fa188f6e1d8e73057606010))
  * ?s ([237f0076](https://github.com/NCI-GDC/portal-ui/commit/237f00762a263169087ff20f92b462219a2a849f))
  * adds ngInject to export ctrl ([d4b46b22](https://github.com/NCI-GDC/portal-ui/commit/d4b46b22e49d39f4659888188583dc28cb29c587))
  * prevent no data flash ([758afd15](https://github.com/NCI-GDC/portal-ui/commit/758afd159e3d92f25fbd7fe58822174fc859c641))
* **tableicious:**
  * Rerun compiles. ([db1f12a7](https://github.com/NCI-GDC/portal-ui/commit/db1f12a7983c07ae4c8f53a2b73cc6c881112854), closes [OICR-408](https://jira.opensciencedatacloud.org/browse/OICR-408))
  * Use ng-href for links. ([c55e3ddf](https://github.com/NCI-GDC/portal-ui/commit/c55e3ddf7cece5a3d8924ea447fa3e1b04cc8401))
* **tables:**
  * Default size to 20. ([80036b5d](https://github.com/NCI-GDC/portal-ui/commit/80036b5d6804c755a5db3e24074f106d167a1603), closes [OICR-597](https://jira.opensciencedatacloud.org/browse/OICR-597))
  * Add margin to bottom of tables. ([aa291d2a](https://github.com/NCI-GDC/portal-ui/commit/aa291d2a7a48f3f0b38debc319fd325accbe2f3b), closes [OICR-609](https://jira.opensciencedatacloud.org/browse/OICR-609))
* **title:** change case ([fbccb5a0](https://github.com/NCI-GDC/portal-ui/commit/fbccb5a022c3bc2cdd0c5e0810c8670fe0d13d48), closes [OICR-600](https://jira.opensciencedatacloud.org/browse/OICR-600))
* **ui:** general touchups ([4b31b487](https://github.com/NCI-GDC/portal-ui/commit/4b31b4876fc1efc2fbfe7cf263b91c875fa5ea28), closes [OICR-240](https://jira.opensciencedatacloud.org/browse/OICR-240))


#### Features

* **a11y:**
  * Improve colour contrast in app. ([614860a6](https://github.com/NCI-GDC/portal-ui/commit/614860a63a0b9b82d2a18eed586b99d8c701c570), closes [OICR-283](https://jira.opensciencedatacloud.org/browse/OICR-283))
  * Add better a11y features for graphs. ([f79a0141](https://github.com/NCI-GDC/portal-ui/commit/f79a0141484294c2674ad54780c86d009683b626), closes [OICR-281](https://jira.opensciencedatacloud.org/browse/OICR-281))
  * Use label elem for heading. ([b430866b](https://github.com/NCI-GDC/portal-ui/commit/b430866b2b9ae52b1171669331bd50719e024185), closes [OICR-282](https://jira.opensciencedatacloud.org/browse/OICR-282))
* **api:** add warning for wrong version ([9585248e](https://github.com/NCI-GDC/portal-ui/commit/9585248e5e1cae069e26ec58299fdbffdde2bc87), closes [OICR-251](https://jira.opensciencedatacloud.org/browse/OICR-251))
* **app:**
  * Update all the UI. ([446b24e8](https://github.com/NCI-GDC/portal-ui/commit/446b24e8523396cdb47e4c1ae33c9c294fe6d4ce), closes [OICR-366](https://jira.opensciencedatacloud.org/browse/OICR-366))
  * Redo warning as modal. ([2101c4cd](https://github.com/NCI-GDC/portal-ui/commit/2101c4cdea99b6d5c713697615bbd1e8f868459c))
  * Add NCI Warning Banner. ([9554e28d](https://github.com/NCI-GDC/portal-ui/commit/9554e28de1125966118748a7794370b594c8167c), closes [OICR-380](https://jira.opensciencedatacloud.org/browse/OICR-380))
  * Pass filters to autocomplete. ([1378154c](https://github.com/NCI-GDC/portal-ui/commit/1378154c3883e21e98cc4cd3d8b40e6ec07d511a), closes [OICR-364](https://jira.opensciencedatacloud.org/browse/OICR-364))
  * use export-table with gdc-table ([8097c365](https://github.com/NCI-GDC/portal-ui/commit/8097c36522cc0dc26adb0facec41d770bcce4783))
  * show api ver in ui ([1bf7f5f6](https://github.com/NCI-GDC/portal-ui/commit/1bf7f5f68ebc23ac8278737467dba79a7d8ce15e), closes [OICR-249](https://jira.opensciencedatacloud.org/browse/OICR-249))
* **auth:** Points login to NCI. ([1fa8e22b](https://github.com/NCI-GDC/portal-ui/commit/1fa8e22b5833824d94d1644acc4706f13b41729d), closes [OICR-192](https://jira.opensciencedatacloud.org/browse/OICR-192))
* **cart:**
  * update ([b39d1ee5](https://github.com/NCI-GDC/portal-ui/commit/b39d1ee5ebbf78443eba93f16b73e274c10ec257))
  * add pie chart ([f8a71b4b](https://github.com/NCI-GDC/portal-ui/commit/f8a71b4b6658c548371e7c8b6e0dfa46c331cd84))
  * manifest link ([e304f166](https://github.com/NCI-GDC/portal-ui/commit/e304f1666fd95cdcda3dfc402a05a0f4f32833b9))
  * updates download options ([356a24b6](https://github.com/NCI-GDC/portal-ui/commit/356a24b6118930cceb297b60a16b47874963657a), closes [OICR-300](https://jira.opensciencedatacloud.org/browse/OICR-300))
  * increase limit to 10,000 ([e173d2af](https://github.com/NCI-GDC/portal-ui/commit/e173d2af157830605f946b42ad6b8c1a6acf39b2))
* **directives:** refactor count tbl as directive ([d4d56802](https://github.com/NCI-GDC/portal-ui/commit/d4d56802cb98a787bfba9fb5b36e299062ae78fe))
* **export:** Apply my projects as filters. ([88fdc9f9](https://github.com/NCI-GDC/portal-ui/commit/88fdc9f94d6c15eb4023839c2b82f28635c1190f), closes [OICR-363](https://jira.opensciencedatacloud.org/browse/OICR-363))
* **export-table:** Cancel export requests. ([f0f8e2f8](https://github.com/NCI-GDC/portal-ui/commit/f0f8e2f879bf849b526e28296c1c8ee3a57c917f), closes [OICR-277](https://jira.opensciencedatacloud.org/browse/OICR-277))
* **export-tables:** add csv & tsv ([c5421964](https://github.com/NCI-GDC/portal-ui/commit/c542196461f5740a74bb87ec7c81f99b9e48ac26), closes [OICR-286](https://jira.opensciencedatacloud.org/browse/OICR-286))
* **facets:**
  * Always show active facet. ([8b4dadac](https://github.com/NCI-GDC/portal-ui/commit/8b4dadace1b8c865ff231ca893d877c9f21c989d), closes [OICR-544](https://jira.opensciencedatacloud.org/browse/OICR-544))
  * Support OR facets in UI. ([91293acb](https://github.com/NCI-GDC/portal-ui/commit/91293acb48950bbfd2cf87ed310e7711311338df), closes [OICR-252](https://jira.opensciencedatacloud.org/browse/OICR-252))
  * Updates for multiple terms. ([6d2adf59](https://github.com/NCI-GDC/portal-ui/commit/6d2adf59a1f972552385cd02f5e2032d3a4e9ae8), closes [OICR-250](https://jira.opensciencedatacloud.org/browse/OICR-250))
  * Keyboard support for autocomplete. ([afd34269](https://github.com/NCI-GDC/portal-ui/commit/afd342695e808c391473bde2a58332ed0e68076c), closes [OICR-221](https://jira.opensciencedatacloud.org/browse/OICR-221))
* **file:** simplifies download buttons ([5de103e4](https://github.com/NCI-GDC/portal-ui/commit/5de103e4d68b65bb3feb93e2c04683c5a209c17c), closes [OICR-506](https://jira.opensciencedatacloud.org/browse/OICR-506))
* **gql:**
  * removes duplicates in autocomplete ([afd7a43b](https://github.com/NCI-GDC/portal-ui/commit/afd7a43b68790dbf04b13618b421c6bc1ebb8a59), closes [OICR-626](https://jira.opensciencedatacloud.org/browse/OICR-626))
  * autocomplete IN arrays ([838ac891](https://github.com/NCI-GDC/portal-ui/commit/838ac89197d539cf6f248071082af7038e629f59))
  * adds better infix suggest ([2d2f02f1](https://github.com/NCI-GDC/portal-ui/commit/2d2f02f154453a4741803974e9d21756be0065f7))
  * expand grammar ([571c2a04](https://github.com/NCI-GDC/portal-ui/commit/571c2a04679ac11ec0d6b1f834e50cc30c2f0ba9))
  * adds support for top level ops. ([784d48d8](https://github.com/NCI-GDC/portal-ui/commit/784d48d842734da7b808a28c1675a0c41ca9582f))
* **graph:**
  * display all codes ([7c27de78](https://github.com/NCI-GDC/portal-ui/commit/7c27de78701ff2e991813fe44b50ba8e4b08170f))
  * add truncation ([4b4b591b](https://github.com/NCI-GDC/portal-ui/commit/4b4b591becd0784f4b36fe9af94a32d642065a44), closes [OICR-362](https://jira.opensciencedatacloud.org/browse/OICR-362))
  * githut variable height ([d0f4898a](https://github.com/NCI-GDC/portal-ui/commit/d0f4898aeeb0e8ce4e631f24bd70b25ffc70707a), closes [OICR-385](https://jira.opensciencedatacloud.org/browse/OICR-385))
  * make githut repsonsive ([1139dd54](https://github.com/NCI-GDC/portal-ui/commit/1139dd54e6ffec21ecd2bb80df6c3bd138a666fd))
  * various fixes to graph et al ([b7823c96](https://github.com/NCI-GDC/portal-ui/commit/b7823c964bed7375e42bc2ac3c7881ab4a54bf52), closes [OICR-373](https://jira.opensciencedatacloud.org/browse/OICR-373))
  * fix regression ([b307365f](https://github.com/NCI-GDC/portal-ui/commit/b307365f49f445c8c30267206f31136287df57a9))
  * fix primary site alignment ([7fc97b47](https://github.com/NCI-GDC/portal-ui/commit/7fc97b47027b91e36f589044e86981fb8b48779e), closes [OICR-362](https://jira.opensciencedatacloud.org/browse/OICR-362))
  * add githut graph (WIP) ([0aa7cc44](https://github.com/NCI-GDC/portal-ui/commit/0aa7cc44eddcffb84fa1666f0bed7ca9462592f7), closes [OICR-301](https://jira.opensciencedatacloud.org/browse/OICR-301), [OICR-341](https://jira.opensciencedatacloud.org/browse/OICR-341), [OICR-337](https://jira.opensciencedatacloud.org/browse/OICR-337), [OICR-349](https://jira.opensciencedatacloud.org/browse/OICR-349))
* **login:**
  * Add auth token downloading. ([49e9c311](https://github.com/NCI-GDC/portal-ui/commit/49e9c311249a616b106139f36bd5bd32f6d881d6), closes [OICR-563](https://jira.opensciencedatacloud.org/browse/OICR-563))
  * returns to current page ([d2e50aa1](https://github.com/NCI-GDC/portal-ui/commit/d2e50aa1231a86e17f87fce66239ea17ee113f6e))
  * Use cookies for login mockup. ([e052943c](https://github.com/NCI-GDC/portal-ui/commit/e052943c6ad1e0837faceb9f4c6528df5d9a9fe1), closes [OICR-338](https://jira.opensciencedatacloud.org/browse/OICR-338))
* **partipant:** add download clinical xml ([db607374](https://github.com/NCI-GDC/portal-ui/commit/db60737494ae36194a0913dff336143cdf9a9a34), closes [OICR-417](https://jira.opensciencedatacloud.org/browse/OICR-417))
* **pc:**
  * implement both superheader ([30426945](https://github.com/NCI-GDC/portal-ui/commit/30426945c1ef6a898b827f125608900ec211bcaf))
  * show primary site labels ([91648c0c](https://github.com/NCI-GDC/portal-ui/commit/91648c0c88119a3edc3e694160e1242dadf9276a), closes [OICR-405](https://jira.opensciencedatacloud.org/browse/OICR-405))
  * simplify x-axis ([56064b1d](https://github.com/NCI-GDC/portal-ui/commit/56064b1d3b544967e62deffdd14b64d1ac4cd364), closes [OICR-406](https://jira.opensciencedatacloud.org/browse/OICR-406), [OICR-407](https://jira.opensciencedatacloud.org/browse/OICR-407))
* **popup:** close login loop ([d50e2c8a](https://github.com/NCI-GDC/portal-ui/commit/d50e2c8ad2d8563c2a8355c6873e55fa1a63258a))
* **projects:** Adds Primary Site facet. ([8095dcfd](https://github.com/NCI-GDC/portal-ui/commit/8095dcfd03e5c2cd8e8a199c612faf62d9c7cba8), closes [OICR-322](https://jira.opensciencedatacloud.org/browse/OICR-322))
* **query:**
  * updates query page to match search ([c5cdab2d](https://github.com/NCI-GDC/portal-ui/commit/c5cdab2d0271fe7a1d45c0f04914a169150a851c))
  * adds autosuggest for gql ([a74e4fe0](https://github.com/NCI-GDC/portal-ui/commit/a74e4fe0fdcc173e9660a4be3c2b9c7f7e803376))
* **report:** adds more data for download report ([44f1c651](https://github.com/NCI-GDC/portal-ui/commit/44f1c65133e93c38fe220664de4653229bc9481b), closes [OICR-575](https://jira.opensciencedatacloud.org/browse/OICR-575))
* **reports:** add reports page ([0fad8962](https://github.com/NCI-GDC/portal-ui/commit/0fad8962b414c82a3e17c571e5e720650ca024be), closes [OICR-365](https://jira.opensciencedatacloud.org/browse/OICR-365))
* **search:**
  * adds summary tables ([82a9421a](https://github.com/NCI-GDC/portal-ui/commit/82a9421a87c5be0f20d6c067a18f5dac1be46b0e), closes [OICR-381](https://jira.opensciencedatacloud.org/browse/OICR-381))
  * export tbl to file ([5d034272](https://github.com/NCI-GDC/portal-ui/commit/5d034272c83631b3b3694585a8f3f355603fd216))
* **styles:** match gdc theme ([8fd81e34](https://github.com/NCI-GDC/portal-ui/commit/8fd81e34d1914567efeab203fa918c637429aa91), closes [OICR-267](https://jira.opensciencedatacloud.org/browse/OICR-267))
* **table:**
  * pluginify sort and reorder ([e1af6519](https://github.com/NCI-GDC/portal-ui/commit/e1af6519250f605969ee23a709b940258d25c6fd))
  * truncate cells with css ([3ebab0d1](https://github.com/NCI-GDC/portal-ui/commit/3ebab0d1a2aeb62a6910c6ca85443b985d071efb))
  * reset within arrange ([6042dbb6](https://github.com/NCI-GDC/portal-ui/commit/6042dbb6588562d11cc1acba036179380a9e57b3))
  * sort, visibility reorder ([ce1965ab](https://github.com/NCI-GDC/portal-ui/commit/ce1965aba3c6eb2f54891ec36fbc7fd48df0b7b5), closes [OICR-247](https://jira.opensciencedatacloud.org/browse/OICR-247))
  * add reset button to table ([47e42caf](https://github.com/NCI-GDC/portal-ui/commit/47e42cafe26caae726299581e8386c7d730eb684), closes [OICR-261](https://jira.opensciencedatacloud.org/browse/OICR-261))
  * nested fields ([490b62dc](https://github.com/NCI-GDC/portal-ui/commit/490b62dc4927c5b974d7e29bbf50f5a3db5915ed))
  * fix bug ([0ae9e336](https://github.com/NCI-GDC/portal-ui/commit/0ae9e3364e3483f9d8e82eff1d3ada71b90dd1ed))
  * add compile ([d567af1b](https://github.com/NCI-GDC/portal-ui/commit/d567af1b1c4d01390b1db8c4cee7ed437e314722), closes [OICR-232](https://jira.opensciencedatacloud.org/browse/OICR-232))
  * sref in trycatch ([e1e8fda4](https://github.com/NCI-GDC/portal-ui/commit/e1e8fda4af0f83f293323eae48d7276596d750ae))
  * fix bug ([8dead21d](https://github.com/NCI-GDC/portal-ui/commit/8dead21d37bfaaa80e895bd8e97cc09acd146cc9))
  * add directive to search page ([239ea774](https://github.com/NCI-GDC/portal-ui/commit/239ea77490f9fc555f77dbe38fca25bf0dff5cef))
* **tableicious:**
  * search filter to dropdown ([d527ff02](https://github.com/NCI-GDC/portal-ui/commit/d527ff02792bba5bae95380af50219e28cbd2a54), closes [OICR-243](https://jira.opensciencedatacloud.org/browse/OICR-243))
  * Control table loading spinner. ([1a68e1cd](https://github.com/NCI-GDC/portal-ui/commit/1a68e1cdf601328edb86e7803602c3ec8b6690ca), closes [OICR-219](https://jira.opensciencedatacloud.org/browse/OICR-219))
* **tables:** Create GDC wrappeer table directive. ([2890b07d](https://github.com/NCI-GDC/portal-ui/commit/2890b07d5043c2d8e8cee2158c5e601b9872796f), closes [OICR-220](https://jira.opensciencedatacloud.org/browse/OICR-220))
* **ui:** general ui updates ([997874ed](https://github.com/NCI-GDC/portal-ui/commit/997874edaa9c08b879b97cb95a6d60dad8616588), closes [OICR-302](https://jira.opensciencedatacloud.org/browse/OICR-302))


### 0.1.10-spr4 (2015-03-18)


#### Bug Fixes

* **annotation:**
  * get entity_submitter_id ([f6b37cfd](https://github.com/NCI-GDC/portal-ui/commit/f6b37cfd0e50b3f2a6f9b428775a688f92eb3bba), closes [OICR-558](https://jira.opensciencedatacloud.org/browse/OICR-558))
  * sumbitter_id->entity_submitter_id ([a73eedbb](https://github.com/NCI-GDC/portal-ui/commit/a73eedbb19d0dce2f43fa20dde1496d9e5c39502), closes [OICR-558](https://jira.opensciencedatacloud.org/browse/OICR-558))
  * annotations num on participant pg ([ad219fcb](https://github.com/NCI-GDC/portal-ui/commit/ad219fcb068693d573fabf17ce34c242fc789d76), closes [OICR-418](https://jira.opensciencedatacloud.org/browse/OICR-418))
  * correct project page link ([d486340a](https://github.com/NCI-GDC/portal-ui/commit/d486340ae2f2125889ec795b0c1d0ec939fadf1c), closes [OICR-490](https://jira.opensciencedatacloud.org/browse/OICR-490))
* **annotations:**
  * Apply my projects filters. ([c8dbc00f](https://github.com/NCI-GDC/portal-ui/commit/c8dbc00fb64cbb80ea41a0995d2caabd6a2eab59), closes [OICR-640](https://jira.opensciencedatacloud.org/browse/OICR-640))
  * Split up classification word. ([e38b7d4c](https://github.com/NCI-GDC/portal-ui/commit/e38b7d4ccf6d5bc3e450fc3777c9cad9f33f3712), closes [OICR-634](https://jira.opensciencedatacloud.org/browse/OICR-634))
  * updates ([ed5a3de2](https://github.com/NCI-GDC/portal-ui/commit/ed5a3de21fc5d23d7d06d7c04c1e86a5efe3968e))
  * Use project_id for facet. ([23659ed2](https://github.com/NCI-GDC/portal-ui/commit/23659ed2d655c86e547c8c7602c5789995fddf20), closes [OICR-573](https://jira.opensciencedatacloud.org/browse/OICR-573))
  * still display facets on back ([09c6f41a](https://github.com/NCI-GDC/portal-ui/commit/09c6f41ad422e0ea47bc83f2e94c346a7f9b2a8e), closes [OICR-557](https://jira.opensciencedatacloud.org/browse/OICR-557))
  * update field names ([616ff868](https://github.com/NCI-GDC/portal-ui/commit/616ff868500e0e47889de041cea0742d7820db09), closes [OICR-555](https://jira.opensciencedatacloud.org/browse/OICR-555), [OICR-484](https://jira.opensciencedatacloud.org/browse/OICR-484), [OICR-491](https://jira.opensciencedatacloud.org/browse/OICR-491), [OICR-535](https://jira.opensciencedatacloud.org/browse/OICR-535))
  * Fix participant link ([c6c45568](https://github.com/NCI-GDC/portal-ui/commit/c6c45568c18ce2311b78eb545d9c1ff172a7f885))
  * display project name in facet ([b311bcc4](https://github.com/NCI-GDC/portal-ui/commit/b311bcc4c8b6f296e9dbcb00aa57c8cdd83f5401), closes [OICR-519](https://jira.opensciencedatacloud.org/browse/OICR-519))
  * use participant_id ([b045c50e](https://github.com/NCI-GDC/portal-ui/commit/b045c50ee261134ab079e1afcf494c5756b3f835), closes [OICR-489](https://jira.opensciencedatacloud.org/browse/OICR-489))
  * show classification facet ([98c03a4b](https://github.com/NCI-GDC/portal-ui/commit/98c03a4b90a105a074fa6f2fab890844d4649a83), closes [OICR-488](https://jira.opensciencedatacloud.org/browse/OICR-488))
* **app:**
  * Update facets displayed/order. ([91a5d342](https://github.com/NCI-GDC/portal-ui/commit/91a5d34293978e24e68676b93f7d1e17cfa2c667), closes [OICR-610](https://jira.opensciencedatacloud.org/browse/OICR-610))
  * Remove columns in Cart and Files. ([c62330c8](https://github.com/NCI-GDC/portal-ui/commit/c62330c812c10ec5ba63efec88715bd3815c8656), closes [OICR-591](https://jira.opensciencedatacloud.org/browse/OICR-591))
  * Remove revision columns from pages. ([1449fdbe](https://github.com/NCI-GDC/portal-ui/commit/1449fdbed145fb304f0f9d813dc61b0776532c93), closes [OICR-595](https://jira.opensciencedatacloud.org/browse/OICR-595))
  * Prevent multiple menu items active. ([b6407bf8](https://github.com/NCI-GDC/portal-ui/commit/b6407bf80d6973a99405d2e82340c5ef6e4fc354), closes [OICR-568](https://jira.opensciencedatacloud.org/browse/OICR-568))
  * some typescript errors ([3e6bcdd4](https://github.com/NCI-GDC/portal-ui/commit/3e6bcdd48f960b4e54efa8cbe5de2732f5208ef8))
  * Hide sidebar nav small screens. ([56acaf36](https://github.com/NCI-GDC/portal-ui/commit/56acaf36d0ada24abd462765015eccd5c229eadd), closes [OICR-307](https://jira.opensciencedatacloud.org/browse/OICR-307))
* **cart:**
  * fix manifest not respecting selected ([5336ea78](https://github.com/NCI-GDC/portal-ui/commit/5336ea78d8c84595a773c7e0bb82cfb3ab43396a))
  * fix downloads not respecting selected ([309075f7](https://github.com/NCI-GDC/portal-ui/commit/309075f79646bb597f61ca6e92f2c5291a49e1d2))
  * fix popup counts ([d9dea729](https://github.com/NCI-GDC/portal-ui/commit/d9dea729edad055be8ed359638af6b33f81d000f))
  * works ([23d1a604](https://github.com/NCI-GDC/portal-ui/commit/23d1a6043b5985c47da2ebccb097a8f101de2178))
  * fix my project row ([bebb9dbf](https://github.com/NCI-GDC/portal-ui/commit/bebb9dbf310fc0b02e7528cd7a50dc544492ed41))
  * Fixes for cart ([db08ab48](https://github.com/NCI-GDC/portal-ui/commit/db08ab48799bb92e559ddb9ebab3330aac597c2a))
  * move dl manifest out of dropdown ([94fae86e](https://github.com/NCI-GDC/portal-ui/commit/94fae86e851d8f3b666e5f51eb6180e2599d5f2d), closes [OICR-603](https://jira.opensciencedatacloud.org/browse/OICR-603))
  * display files not added notification ([ca342ff7](https://github.com/NCI-GDC/portal-ui/commit/ca342ff7ea67f9fcdd4060012c34f1726598e739), closes [OICR-622](https://jira.opensciencedatacloud.org/browse/OICR-622))
  * remove dl metadata ([30134e5b](https://github.com/NCI-GDC/portal-ui/commit/30134e5bc7c71fda68eab907a9bbdd97bd21ac70), closes [OICR-583](https://jira.opensciencedatacloud.org/browse/OICR-583))
  * always show annotation length ([9c0fd797](https://github.com/NCI-GDC/portal-ui/commit/9c0fd797395ec5f1fe4246bb385becd67f02c8dc), closes [OICR-589](https://jira.opensciencedatacloud.org/browse/OICR-589))
  * fix add/remove from cart ([3fe4c3d5](https://github.com/NCI-GDC/portal-ui/commit/3fe4c3d5260dd383ea8529ea23337bbaf02dc256), closes [OICR-618](https://jira.opensciencedatacloud.org/browse/OICR-618))
  * hide cart chart on 0 items ([6e522a22](https://github.com/NCI-GDC/portal-ui/commit/6e522a225c38a8aed4d2fcf8a821a2cebe6bad75))
  * display missing fields ([099d5d1e](https://github.com/NCI-GDC/portal-ui/commit/099d5d1ed968cc43022ba7a8674a3583a1e4b6de), closes [OICR-457](https://jira.opensciencedatacloud.org/browse/OICR-457))
* **colors:** fix project list colors ([6d104ef3](https://github.com/NCI-GDC/portal-ui/commit/6d104ef3f2500309d7fd0b6c1a59a01d6dbfd4e8), closes [OICR-561](https://jira.opensciencedatacloud.org/browse/OICR-561))
* **dnd:** fixing reordering bug ([18dc1128](https://github.com/NCI-GDC/portal-ui/commit/18dc1128ff6feedb6afab708550d01c8b41c6e05), closes [OICR-316](https://jira.opensciencedatacloud.org/browse/OICR-316))
* **download:** add related_ids to download ([794daacd](https://github.com/NCI-GDC/portal-ui/commit/794daacd057288410e8be2b8a7294e8f8ce98259), closes [OICR-624](https://jira.opensciencedatacloud.org/browse/OICR-624))
* **entity:**
  * participant fixes ([0812193f](https://github.com/NCI-GDC/portal-ui/commit/0812193f2b10dedd6831430bbff58e76bf4c9a33), closes [OICR-596](https://jira.opensciencedatacloud.org/browse/OICR-596))
  * update language ([61b7e045](https://github.com/NCI-GDC/portal-ui/commit/61b7e0456c19dba20163f90e1f51e32a39c2fae9))
* **facets:** Consistent spacing for terms. ([7734cbc4](https://github.com/NCI-GDC/portal-ui/commit/7734cbc44caf7fe33c462aadb2c652203dba468f), closes [OICR-611](https://jira.opensciencedatacloud.org/browse/OICR-611))
* **file:**
  * Update associated entities. ([3acb7926](https://github.com/NCI-GDC/portal-ui/commit/3acb7926c52e047d02952aeec6661db092d13b22), closes [OICR-531](https://jira.opensciencedatacloud.org/browse/OICR-531))
  * add dl access modal ([70037cc7](https://github.com/NCI-GDC/portal-ui/commit/70037cc73c53ac3dd6329b65a961fe950a03cc59), closes [OICR-550](https://jira.opensciencedatacloud.org/browse/OICR-550))
  * set archiveCount to 0 when no archive ([96434f03](https://github.com/NCI-GDC/portal-ui/commit/96434f03a35a53f4fd98e9a700cf14e5b1aa858d), closes [OICR-525](https://jira.opensciencedatacloud.org/browse/OICR-525))
  * match mockup ([cf2d293b](https://github.com/NCI-GDC/portal-ui/commit/cf2d293b3f6b513341e28caf89c219a0e99013d3), closes [OICR-516](https://jira.opensciencedatacloud.org/browse/OICR-516))
  * find file same archive ([19ad64b4](https://github.com/NCI-GDC/portal-ui/commit/19ad64b4fa96f57f4ffd3432e2662bfca5665147), closes [OICR-485](https://jira.opensciencedatacloud.org/browse/OICR-485))
  * add to cart from file page ([3b7bf382](https://github.com/NCI-GDC/portal-ui/commit/3b7bf382f4ba1df2fad2b14d2fb8d9e0ce70bf32), closes [OICR-497](https://jira.opensciencedatacloud.org/browse/OICR-497))
  * related files type ([9c6a3b4c](https://github.com/NCI-GDC/portal-ui/commit/9c6a3b4c8ce041a94641830b1416cbd95de52da0))
* **files:**
  * Track by entity_id over participant_id ([159a80df](https://github.com/NCI-GDC/portal-ui/commit/159a80df59a8cdf73862c795a4e33df5c1f4937a))
  * Show '00' remainder for all but Bytes. ([032a75d4](https://github.com/NCI-GDC/portal-ui/commit/032a75d4dfbbc3e5c949159dcd4bc643485fd08f), closes [OICR-577](https://jira.opensciencedatacloud.org/browse/OICR-577))
  * Properly linking to participants. ([00c9158f](https://github.com/NCI-GDC/portal-ui/commit/00c9158f16f50ca7b98f0d3530fd4bc05d230500), closes [OICR-605](https://jira.opensciencedatacloud.org/browse/OICR-605))
  * Trim trailing '00' from filter. ([48c31bb0](https://github.com/NCI-GDC/portal-ui/commit/48c31bb042aded8df054d8d10560c0093dc97244))
  * Update file size filter. ([a19e2f69](https://github.com/NCI-GDC/portal-ui/commit/a19e2f698b2e15b5835c649fcd9965127a6abc29), closes [OICR-577](https://jira.opensciencedatacloud.org/browse/OICR-577))
  * Updates for removed data. ([1c2faebe](https://github.com/NCI-GDC/portal-ui/commit/1c2faebee1d334dcd7b349dcf0fe0b90df53bfee), closes [OICR-530](https://jira.opensciencedatacloud.org/browse/OICR-530))
  * use files.origin ([9da26db2](https://github.com/NCI-GDC/portal-ui/commit/9da26db291e30cc8b1a5e3089f8f2b9f428c2c3b), closes [OICR-532](https://jira.opensciencedatacloud.org/browse/OICR-532))
* **filter:** correct lang ([0100e2e4](https://github.com/NCI-GDC/portal-ui/commit/0100e2e4e5b3836a8e2820a319e5b7ed62b3798a))
* **filters:** makes ?annotations=1 optional ([8f2ac17f](https://github.com/NCI-GDC/portal-ui/commit/8f2ac17f5de33c0798796fb276ce5a4da34bd712), closes [OICR-641](https://jira.opensciencedatacloud.org/browse/OICR-641))
* **footer:** footer fixes ([299ead23](https://github.com/NCI-GDC/portal-ui/commit/299ead23e4c8c4bcbb6850c250c8217c20984c91))
* **githut:**
  * fix project page ([6a74efd1](https://github.com/NCI-GDC/portal-ui/commit/6a74efd1bcdc511d493f907b5827a771fceb7254))
  * change project order ([164f7865](https://github.com/NCI-GDC/portal-ui/commit/164f7865eb2a402f18e1f935e0c680634a5a1c95))
* **gql:** suggest failing under certain conditions ([4f7de1e6](https://github.com/NCI-GDC/portal-ui/commit/4f7de1e692cc8f26dd6f0bc655f8db3bee7351cc), closes [OICR-559](https://jira.opensciencedatacloud.org/browse/OICR-559))
* **login:**
  * Filter terms for projects. ([faf48e47](https://github.com/NCI-GDC/portal-ui/commit/faf48e47831c281c876d51f4b3c7fa8c3960a709), closes [OICR-542](https://jira.opensciencedatacloud.org/browse/OICR-542))
  * Updates for API changes. ([a1118777](https://github.com/NCI-GDC/portal-ui/commit/a11187778bffbc423be1e525f01032c1db3e3873), closes [OICR-542](https://jira.opensciencedatacloud.org/browse/OICR-542))
* **myprojects:** Don't hide facet when logged in. ([9259dcc5](https://github.com/NCI-GDC/portal-ui/commit/9259dcc59ae35a165d1d7894b5baff4e62d9c459), closes [OICR-639](https://jira.opensciencedatacloud.org/browse/OICR-639))
* **pagination:** Fixes size selector. ([21b126e5](https://github.com/NCI-GDC/portal-ui/commit/21b126e59c80f0db1b17ce2afb0775bbf5fb5728), closes [OICR-492](https://jira.opensciencedatacloud.org/browse/OICR-492))
* **part:**
  * suppress error ([360f8160](https://github.com/NCI-GDC/portal-ui/commit/360f8160f5d4976fb44c1a12623afd079079e580), closes [OICR-554](https://jira.opensciencedatacloud.org/browse/OICR-554))
  * show filter files load ([934792a5](https://github.com/NCI-GDC/portal-ui/commit/934792a516d81c4387e0c792035011b63a4addb3))
* **participant:**
  * fix experimental strategies ([5e327ed9](https://github.com/NCI-GDC/portal-ui/commit/5e327ed9bb3b3a51bc754a339ad2d15485e590e9))
  * Biospecimen updates. ([355ea9c5](https://github.com/NCI-GDC/portal-ui/commit/355ea9c515927cb9954581424fcd8dd3a5dbd515))
  * Hide buttons when no file. ([37956139](https://github.com/NCI-GDC/portal-ui/commit/37956139f1ada80715bd12854cbff371b6571066), closes [OICR-614](https://jira.opensciencedatacloud.org/browse/OICR-614))
  * check if file found ([a02f693a](https://github.com/NCI-GDC/portal-ui/commit/a02f693a0b79df5608e29a31b462f8149182b0f7), closes [OICR-551](https://jira.opensciencedatacloud.org/browse/OICR-551))
  * Updates for Biospecimen. ([7761077c](https://github.com/NCI-GDC/portal-ui/commit/7761077c39d6f1d61bcdd557fe651390306b9692), closes [OICR-515](https://jira.opensciencedatacloud.org/browse/OICR-515))
  * use count tabl directive ([9395faaa](https://github.com/NCI-GDC/portal-ui/commit/9395faaa12fb777f3ba1f2f957c51755eabeb3f7), closes [OICR-512](https://jira.opensciencedatacloud.org/browse/OICR-512), [OICR-511](https://jira.opensciencedatacloud.org/browse/OICR-511))
  * search page links work ([d72e06ab](https://github.com/NCI-GDC/portal-ui/commit/d72e06ab9400668a64db5c7b4860eb2d4a491e63), closes [OICR-416](https://jira.opensciencedatacloud.org/browse/OICR-416))
  * dl biospecimen xml ([4dab658d](https://github.com/NCI-GDC/portal-ui/commit/4dab658d9ac15b16e758d701f0e758d4c5adc56f), closes [OICR-493](https://jira.opensciencedatacloud.org/browse/OICR-493))
  * expand all biospecimen ([1363d1dc](https://github.com/NCI-GDC/portal-ui/commit/1363d1dc5ce2d99673b9132daed8735fee88fdc8))
  * add project-name and program tbd ([77d95ac7](https://github.com/NCI-GDC/portal-ui/commit/77d95ac762df26455d01ea2882300e05266aca9c))
* **participants:**
  * avail. str. heading spacing ([e65fc88d](https://github.com/NCI-GDC/portal-ui/commit/e65fc88de4f175219c5cad1ccdfddf61426f4768), closes [OICR-469](https://jira.opensciencedatacloud.org/browse/OICR-469))
  * use diesease_type ([16b676f4](https://github.com/NCI-GDC/portal-ui/commit/16b676f42fd992dd2a4eee8635b4291ebde4b39c))
  * show annotation number ([9ac045e3](https://github.com/NCI-GDC/portal-ui/commit/9ac045e3fbcc243ad7525226ae9ef4f32fed2935), closes [OICR-418](https://jira.opensciencedatacloud.org/browse/OICR-418))
* **pc:**
  * hovering issue ([6280b654](https://github.com/NCI-GDC/portal-ui/commit/6280b6542da990e2a720b8c4b3cb0256c4087cd4), closes [OICR-613](https://jira.opensciencedatacloud.org/browse/OICR-613))
  * hover ([54158cc9](https://github.com/NCI-GDC/portal-ui/commit/54158cc92c30819bbb7d426d95e4d966cd235149))
  * prevent err ([f14c453f](https://github.com/NCI-GDC/portal-ui/commit/f14c453f50243950388ac3982b31d88b9958242d))
  * fix sorting ([042af187](https://github.com/NCI-GDC/portal-ui/commit/042af187ffbc53336ce001ae216527779e66197a))
  * number style ([61feec3a](https://github.com/NCI-GDC/portal-ui/commit/61feec3ac2703e3d8fba7ced21a981e6f8947b90))
  * fix overlap ([552b8516](https://github.com/NCI-GDC/portal-ui/commit/552b8516c649501f56b734e632f75fc7b8957b23))
  * no bold text ([676ed1c9](https://github.com/NCI-GDC/portal-ui/commit/676ed1c994204588c525fb6a57d1bc4d579baf11))
  * no select path ([2f21c2e4](https://github.com/NCI-GDC/portal-ui/commit/2f21c2e4001a85c39f56070062c1ac785d83db94))
  * fixes format and hover issues ([fd1621ef](https://github.com/NCI-GDC/portal-ui/commit/fd1621efb501e7b6b3e68d0b92c5b27dbcb6a39a), closes [OICR-339](https://jira.opensciencedatacloud.org/browse/OICR-339), [OICR-411](https://jira.opensciencedatacloud.org/browse/OICR-411), [OICR-388](https://jira.opensciencedatacloud.org/browse/OICR-388), [OICR-348](https://jira.opensciencedatacloud.org/browse/OICR-348))
* **pie:**
  * change behavoir ([7d090b63](https://github.com/NCI-GDC/portal-ui/commit/7d090b63fa2e589b1b5186af12ea324ba5be8e11))
  * update pie ([44a8f376](https://github.com/NCI-GDC/portal-ui/commit/44a8f37692b9b7cd69a05d8148ad0532e9d5229b), closes [OICR-566](https://jira.opensciencedatacloud.org/browse/OICR-566))
* **project:**
  * experimental strategy data ([918e1de0](https://github.com/NCI-GDC/portal-ui/commit/918e1de0fe8b8c2c49a14c5758f93d60f4d0dee0))
  * update available data ([42dded95](https://github.com/NCI-GDC/portal-ui/commit/42dded9532506d76be24ac9721b66d60275113c3))
* **projects:**
  * Fixes searching my project codes. ([ea78b357](https://github.com/NCI-GDC/portal-ui/commit/ea78b357c9a7a422df789f978dff1b4e2aad99b1), closes [OICR-567](https://jira.opensciencedatacloud.org/browse/OICR-567))
  * Prevent 0 counts being links. ([57c58dd6](https://github.com/NCI-GDC/portal-ui/commit/57c58dd662951923b65592aa3643fa3ea2136ffd))
  * Ensure table tab is defaulted. ([26bd423d](https://github.com/NCI-GDC/portal-ui/commit/26bd423d0bf797d6292e9b66007d5f50d85d1398), closes [OICR-510](https://jira.opensciencedatacloud.org/browse/OICR-510))
  * fixes pc sorting ([b41de43f](https://github.com/NCI-GDC/portal-ui/commit/b41de43f3378534c9b6bf265b215bf856466ab77), closes [OICR-464](https://jira.opensciencedatacloud.org/browse/OICR-464))
  * Fixes for Projects List. ([54e7f0fd](https://github.com/NCI-GDC/portal-ui/commit/54e7f0fd8252c813b16014520d4324d427dd7752), closes [OICR-420](https://jira.opensciencedatacloud.org/browse/OICR-420), [OICR-427](https://jira.opensciencedatacloud.org/browse/OICR-427), [OICR-474](https://jira.opensciencedatacloud.org/browse/OICR-474), [OICR-428](https://jira.opensciencedatacloud.org/browse/OICR-428), [OICR-422](https://jira.opensciencedatacloud.org/browse/OICR-422), [OICR-425](https://jira.opensciencedatacloud.org/browse/OICR-425))
* **query:** Active sub view persists on switch. ([18561bdf](https://github.com/NCI-GDC/portal-ui/commit/18561bdf8aae2a2895446b3723562c8380b66645), closes [OICR-601](https://jira.opensciencedatacloud.org/browse/OICR-601))
* **report:**
  * report url hotfix ([9619bdf0](https://github.com/NCI-GDC/portal-ui/commit/9619bdf05217f17b3bf947a182fce18c9fc99b23))
  * update data types ([ec9b83bd](https://github.com/NCI-GDC/portal-ui/commit/ec9b83bd26bcbfcf74adaf7e809fc1dbf58bf11e))
* **reports:**
  * no nav ([e2fa37c1](https://github.com/NCI-GDC/portal-ui/commit/e2fa37c1dc559e148c0f5ea3c5cc1bbccf1d32d7))
  * data reports fixes ([5649c7c2](https://github.com/NCI-GDC/portal-ui/commit/5649c7c2fa2cd59a166bfe5d1a53d4f4a970dbca), closes [OICR-629](https://jira.opensciencedatacloud.org/browse/OICR-629), [OICR-630](https://jira.opensciencedatacloud.org/browse/OICR-630))
  * fix button ([0e13268e](https://github.com/NCI-GDC/portal-ui/commit/0e13268e3831132435a4709500175a990f69da51))
  * download report data ([4006be85](https://github.com/NCI-GDC/portal-ui/commit/4006be85403095f57197f6efc03418fa7e9a5838), closes [OICR-397](https://jira.opensciencedatacloud.org/browse/OICR-397), [OICR-463](https://jira.opensciencedatacloud.org/browse/OICR-463), [OICR-434](https://jira.opensciencedatacloud.org/browse/OICR-434))
  * various features and bugs ([7e7d563c](https://github.com/NCI-GDC/portal-ui/commit/7e7d563ce7ea270908ab67d3f3b4809dd4763080))
* **search:**
  * Update copy for participants. ([c69cfe53](https://github.com/NCI-GDC/portal-ui/commit/c69cfe53ec20a42a6a67a1d7cc0fa36060a47856), closes [OICR-579](https://jira.opensciencedatacloud.org/browse/OICR-579))
  * Remove GB from summary header. ([ff907fa7](https://github.com/NCI-GDC/portal-ui/commit/ff907fa76ba43cce3475f982f38db6f68533db9c), closes [OICR-576](https://jira.opensciencedatacloud.org/browse/OICR-576))
  * Files for participant linking. ([992dd704](https://github.com/NCI-GDC/portal-ui/commit/992dd70482d988e543b1483f48c7ade59ad25a6d), closes [OICR-571](https://jira.opensciencedatacloud.org/browse/OICR-571))
  * Update UI for add all to cart. ([1d36176e](https://github.com/NCI-GDC/portal-ui/commit/1d36176e3f40ec18b7bae944036d4add5f2254c6), closes [OICR-545](https://jira.opensciencedatacloud.org/browse/OICR-545))
  * Better fix for search files. ([b6602852](https://github.com/NCI-GDC/portal-ui/commit/b66028529e22de38186d84605c24b15dc72fb04d))
  * Fix compile for files. ([5e63e1fe](https://github.com/NCI-GDC/portal-ui/commit/5e63e1fef2aff7fceedf9131600369d863a1fe2c))
  * Table state links update. ([759d5d25](https://github.com/NCI-GDC/portal-ui/commit/759d5d255b54b0af285ac8dc5514e0cd25394da7))
  * Participant file count links ([cd3bf2d5](https://github.com/NCI-GDC/portal-ui/commit/cd3bf2d52dbbf8d8c8db8102683b1f5602160984))
  * Fixes for search page. ([fd1df6fa](https://github.com/NCI-GDC/portal-ui/commit/fd1df6fa19e04cdb523e9d9535139148dcdcc349), closes [OICR-443](https://jira.opensciencedatacloud.org/browse/OICR-443))
* **table:**
  * table icons ([b704ee8a](https://github.com/NCI-GDC/portal-ui/commit/b704ee8a9349f3b8eceb183814b74af55daff031))
  * fix title ([6bbb65fd](https://github.com/NCI-GDC/portal-ui/commit/6bbb65fda943a20f6fa188f6e1d8e73057606010))
  * ?s ([237f0076](https://github.com/NCI-GDC/portal-ui/commit/237f00762a263169087ff20f92b462219a2a849f))
* **tableicious:**
  * Rerun compiles. ([db1f12a7](https://github.com/NCI-GDC/portal-ui/commit/db1f12a7983c07ae4c8f53a2b73cc6c881112854), closes [OICR-408](https://jira.opensciencedatacloud.org/browse/OICR-408))
  * Use ng-href for links. ([c55e3ddf](https://github.com/NCI-GDC/portal-ui/commit/c55e3ddf7cece5a3d8924ea447fa3e1b04cc8401))
* **tables:**
  * Default size to 20. ([80036b5d](https://github.com/NCI-GDC/portal-ui/commit/80036b5d6804c755a5db3e24074f106d167a1603), closes [OICR-597](https://jira.opensciencedatacloud.org/browse/OICR-597))
  * Add margin to bottom of tables. ([aa291d2a](https://github.com/NCI-GDC/portal-ui/commit/aa291d2a7a48f3f0b38debc319fd325accbe2f3b), closes [OICR-609](https://jira.opensciencedatacloud.org/browse/OICR-609))
* **title:** change case ([fbccb5a0](https://github.com/NCI-GDC/portal-ui/commit/fbccb5a022c3bc2cdd0c5e0810c8670fe0d13d48), closes [OICR-600](https://jira.opensciencedatacloud.org/browse/OICR-600))


#### Features

* **cart:**
  * update ([b39d1ee5](https://github.com/NCI-GDC/portal-ui/commit/b39d1ee5ebbf78443eba93f16b73e274c10ec257))
  * add pie chart ([f8a71b4b](https://github.com/NCI-GDC/portal-ui/commit/f8a71b4b6658c548371e7c8b6e0dfa46c331cd84))
  * manifest link ([e304f166](https://github.com/NCI-GDC/portal-ui/commit/e304f1666fd95cdcda3dfc402a05a0f4f32833b9))
* **directives:** refactor count tbl as directive ([d4d56802](https://github.com/NCI-GDC/portal-ui/commit/d4d56802cb98a787bfba9fb5b36e299062ae78fe))
* **facets:** Always show active facet. ([8b4dadac](https://github.com/NCI-GDC/portal-ui/commit/8b4dadace1b8c865ff231ca893d877c9f21c989d), closes [OICR-544](https://jira.opensciencedatacloud.org/browse/OICR-544))
* **file:** simplifies download buttons ([5de103e4](https://github.com/NCI-GDC/portal-ui/commit/5de103e4d68b65bb3feb93e2c04683c5a209c17c), closes [OICR-506](https://jira.opensciencedatacloud.org/browse/OICR-506))
* **gql:**
  * removes duplicates in autocomplete ([afd7a43b](https://github.com/NCI-GDC/portal-ui/commit/afd7a43b68790dbf04b13618b421c6bc1ebb8a59), closes [OICR-626](https://jira.opensciencedatacloud.org/browse/OICR-626))
  * autocomplete IN arrays ([838ac891](https://github.com/NCI-GDC/portal-ui/commit/838ac89197d539cf6f248071082af7038e629f59))
  * adds better infix suggest ([2d2f02f1](https://github.com/NCI-GDC/portal-ui/commit/2d2f02f154453a4741803974e9d21756be0065f7))
* **login:**
  * Add auth token downloading. ([49e9c311](https://github.com/NCI-GDC/portal-ui/commit/49e9c311249a616b106139f36bd5bd32f6d881d6), closes [OICR-563](https://jira.opensciencedatacloud.org/browse/OICR-563))
  * returns to current page ([d2e50aa1](https://github.com/NCI-GDC/portal-ui/commit/d2e50aa1231a86e17f87fce66239ea17ee113f6e))
* **partipant:** add download clinical xml ([db607374](https://github.com/NCI-GDC/portal-ui/commit/db60737494ae36194a0913dff336143cdf9a9a34), closes [OICR-417](https://jira.opensciencedatacloud.org/browse/OICR-417))
* **pc:** implement both superheader ([30426945](https://github.com/NCI-GDC/portal-ui/commit/30426945c1ef6a898b827f125608900ec211bcaf))
* **popup:** close login loop ([d50e2c8a](https://github.com/NCI-GDC/portal-ui/commit/d50e2c8ad2d8563c2a8355c6873e55fa1a63258a))
* **query:** updates query page to match search ([c5cdab2d](https://github.com/NCI-GDC/portal-ui/commit/c5cdab2d0271fe7a1d45c0f04914a169150a851c))
* **report:** adds more data for download report ([44f1c651](https://github.com/NCI-GDC/portal-ui/commit/44f1c65133e93c38fe220664de4653229bc9481b), closes [OICR-575](https://jira.opensciencedatacloud.org/browse/OICR-575))
* **styles:** match gdc theme ([8fd81e34](https://github.com/NCI-GDC/portal-ui/commit/8fd81e34d1914567efeab203fa918c637429aa91), closes [OICR-267](https://jira.opensciencedatacloud.org/browse/OICR-267))


### 0.1.10-spr3 (2015-03-04)


#### Bug Fixes

* **annotations:** match fields ([aa4e723a](https://github.com/NCI-GDC/portal-ui/commit/aa4e723a1e4fc776f27c117484a85e64eb952c6e))
* **app:** fixes filter related bugs ([04f4d81b](https://github.com/NCI-GDC/portal-ui/commit/04f4d81b534e836a91f547e7b98eb903555f4246))
* **file:** fix file page exception ([2b050da9](https://github.com/NCI-GDC/portal-ui/commit/2b050da9266de7aae2636c215e35ff67e0997a30))
* **graph:** update title text ([f37927b8](https://github.com/NCI-GDC/portal-ui/commit/f37927b89069f56d4c3d1b48e6064031f2f9cfc6), closes [OICR-348](https://jira.opensciencedatacloud.org/browse/OICR-348))
* **project:** add graph title ([4a6b17d6](https://github.com/NCI-GDC/portal-ui/commit/4a6b17d6be5302efa4c6f3abbe62cc3985faedc9))


#### Features

* **app:**
  * Update all the UI. ([446b24e8](https://github.com/NCI-GDC/portal-ui/commit/446b24e8523396cdb47e4c1ae33c9c294fe6d4ce), closes [OICR-366](https://jira.opensciencedatacloud.org/browse/OICR-366))
  * Redo warning as modal. ([2101c4cd](https://github.com/NCI-GDC/portal-ui/commit/2101c4cdea99b6d5c713697615bbd1e8f868459c))
  * Add NCI Warning Banner. ([9554e28d](https://github.com/NCI-GDC/portal-ui/commit/9554e28de1125966118748a7794370b594c8167c), closes [OICR-380](https://jira.opensciencedatacloud.org/browse/OICR-380))
  * Pass filters to autocomplete. ([1378154c](https://github.com/NCI-GDC/portal-ui/commit/1378154c3883e21e98cc4cd3d8b40e6ec07d511a), closes [OICR-364](https://jira.opensciencedatacloud.org/browse/OICR-364))
* **auth:** Points login to NCI. ([1fa8e22b](https://github.com/NCI-GDC/portal-ui/commit/1fa8e22b5833824d94d1644acc4706f13b41729d), closes [OICR-192](https://jira.opensciencedatacloud.org/browse/OICR-192))
* **cart:** updates download options ([356a24b6](https://github.com/NCI-GDC/portal-ui/commit/356a24b6118930cceb297b60a16b47874963657a), closes [OICR-300](https://jira.opensciencedatacloud.org/browse/OICR-300))
* **export:** Apply my projects as filters. ([88fdc9f9](https://github.com/NCI-GDC/portal-ui/commit/88fdc9f94d6c15eb4023839c2b82f28635c1190f), closes [OICR-363](https://jira.opensciencedatacloud.org/browse/OICR-363))
* **graph:**
  * display all codes ([7c27de78](https://github.com/NCI-GDC/portal-ui/commit/7c27de78701ff2e991813fe44b50ba8e4b08170f))
  * add truncation ([4b4b591b](https://github.com/NCI-GDC/portal-ui/commit/4b4b591becd0784f4b36fe9af94a32d642065a44), closes [OICR-362](https://jira.opensciencedatacloud.org/browse/OICR-362))
  * githut variable height ([d0f4898a](https://github.com/NCI-GDC/portal-ui/commit/d0f4898aeeb0e8ce4e631f24bd70b25ffc70707a), closes [OICR-385](https://jira.opensciencedatacloud.org/browse/OICR-385))
  * make githut repsonsive ([1139dd54](https://github.com/NCI-GDC/portal-ui/commit/1139dd54e6ffec21ecd2bb80df6c3bd138a666fd))
  * various fixes to graph et al ([b7823c96](https://github.com/NCI-GDC/portal-ui/commit/b7823c964bed7375e42bc2ac3c7881ab4a54bf52), closes [OICR-373](https://jira.opensciencedatacloud.org/browse/OICR-373))
  * fix regression ([b307365f](https://github.com/NCI-GDC/portal-ui/commit/b307365f49f445c8c30267206f31136287df57a9))
  * fix primary site alignment ([7fc97b47](https://github.com/NCI-GDC/portal-ui/commit/7fc97b47027b91e36f589044e86981fb8b48779e), closes [OICR-362](https://jira.opensciencedatacloud.org/browse/OICR-362))
* **pc:**
  * show primary site labels ([91648c0c](https://github.com/NCI-GDC/portal-ui/commit/91648c0c88119a3edc3e694160e1242dadf9276a), closes [OICR-405](https://jira.opensciencedatacloud.org/browse/OICR-405))
  * simplify x-axis ([56064b1d](https://github.com/NCI-GDC/portal-ui/commit/56064b1d3b544967e62deffdd14b64d1ac4cd364), closes [OICR-406](https://jira.opensciencedatacloud.org/browse/OICR-406), [OICR-407](https://jira.opensciencedatacloud.org/browse/OICR-407))
* **projects:** Adds Primary Site facet. ([8095dcfd](https://github.com/NCI-GDC/portal-ui/commit/8095dcfd03e5c2cd8e8a199c612faf62d9c7cba8), closes [OICR-322](https://jira.opensciencedatacloud.org/browse/OICR-322))
* **query:** adds autosuggest for gql ([a74e4fe0](https://github.com/NCI-GDC/portal-ui/commit/a74e4fe0fdcc173e9660a4be3c2b9c7f7e803376))
* **reports:** add reports page ([0fad8962](https://github.com/NCI-GDC/portal-ui/commit/0fad8962b414c82a3e17c571e5e720650ca024be), closes [OICR-365](https://jira.opensciencedatacloud.org/browse/OICR-365))
* **search:** adds summary tables ([82a9421a](https://github.com/NCI-GDC/portal-ui/commit/82a9421a87c5be0f20d6c067a18f5dac1be46b0e), closes [OICR-381](https://jira.opensciencedatacloud.org/browse/OICR-381))


### 0.1.10-spr2 (2015-02-18)


#### Bug Fixes

* **projects:** exp strategy facet works again ([4bebe7b3](https://github.com/NCI-GDC/portal-ui/commit/4bebe7b344398cf9e6e865c03909f35ec97e1be1))
* **search:** fixes facet filters ([af8af372](https://github.com/NCI-GDC/portal-ui/commit/af8af3722603a3aec954d647d329a83e00b870b5))
* **table:** adds ngInject to export ctrl ([d4b46b22](https://github.com/NCI-GDC/portal-ui/commit/d4b46b22e49d39f4659888188583dc28cb29c587))
* **ui:** general touchups ([4b31b487](https://github.com/NCI-GDC/portal-ui/commit/4b31b4876fc1efc2fbfe7cf263b91c875fa5ea28), closes [OICR-240](https://jira.opensciencedatacloud.org/browse/OICR-240))


#### Features

* **a11y:**
  * Improve colour contrast in app. ([614860a6](https://github.com/NCI-GDC/portal-ui/commit/614860a63a0b9b82d2a18eed586b99d8c701c570), closes [OICR-283](https://jira.opensciencedatacloud.org/browse/OICR-283))
  * Add better a11y features for graphs. ([f79a0141](https://github.com/NCI-GDC/portal-ui/commit/f79a0141484294c2674ad54780c86d009683b626), closes [OICR-281](https://jira.opensciencedatacloud.org/browse/OICR-281))
  * Use label elem for heading. ([b430866b](https://github.com/NCI-GDC/portal-ui/commit/b430866b2b9ae52b1171669331bd50719e024185), closes [OICR-282](https://jira.opensciencedatacloud.org/browse/OICR-282))
* **api:** add warning for wrong version ([9585248e](https://github.com/NCI-GDC/portal-ui/commit/9585248e5e1cae069e26ec58299fdbffdde2bc87), closes [OICR-251](https://jira.opensciencedatacloud.org/browse/OICR-251))
* **export-table:** Cancel export requests. ([f0f8e2f8](https://github.com/NCI-GDC/portal-ui/commit/f0f8e2f879bf849b526e28296c1c8ee3a57c917f), closes [OICR-277](https://jira.opensciencedatacloud.org/browse/OICR-277))
* **export-tables:** add csv & tsv ([c5421964](https://github.com/NCI-GDC/portal-ui/commit/c542196461f5740a74bb87ec7c81f99b9e48ac26), closes [OICR-286](https://jira.opensciencedatacloud.org/browse/OICR-286))
* **facets:** Support OR facets in UI. ([91293acb](https://github.com/NCI-GDC/portal-ui/commit/91293acb48950bbfd2cf87ed310e7711311338df), closes [OICR-252](https://jira.opensciencedatacloud.org/browse/OICR-252))
* **gql:**
  * expand grammar ([571c2a04](https://github.com/NCI-GDC/portal-ui/commit/571c2a04679ac11ec0d6b1f834e50cc30c2f0ba9))
  * adds support for top level ops. ([784d48d8](https://github.com/NCI-GDC/portal-ui/commit/784d48d842734da7b808a28c1675a0c41ca9582f))
* **graph:** add githut graph (WIP) ([0aa7cc44](https://github.com/NCI-GDC/portal-ui/commit/0aa7cc44eddcffb84fa1666f0bed7ca9462592f7), closes [OICR-301](https://jira.opensciencedatacloud.org/browse/OICR-301), [OICR-341](https://jira.opensciencedatacloud.org/browse/OICR-341), [OICR-337](https://jira.opensciencedatacloud.org/browse/OICR-337), [OICR-349](https://jira.opensciencedatacloud.org/browse/OICR-349))
* **login:** Use cookies for login mockup. ([e052943c](https://github.com/NCI-GDC/portal-ui/commit/e052943c6ad1e0837faceb9f4c6528df5d9a9fe1), closes [OICR-338](https://jira.opensciencedatacloud.org/browse/OICR-338))
* **table:**
  * pluginify sort and reorder ([e1af6519](https://github.com/NCI-GDC/portal-ui/commit/e1af6519250f605969ee23a709b940258d25c6fd))
  * truncate cells with css ([3ebab0d1](https://github.com/NCI-GDC/portal-ui/commit/3ebab0d1a2aeb62a6910c6ca85443b985d071efb))
  * reset within arrange ([6042dbb6](https://github.com/NCI-GDC/portal-ui/commit/6042dbb6588562d11cc1acba036179380a9e57b3))
* **ui:** general ui updates ([997874ed](https://github.com/NCI-GDC/portal-ui/commit/997874edaa9c08b879b97cb95a6d60dad8616588), closes [OICR-302](https://jira.opensciencedatacloud.org/browse/OICR-302))


### 0.1.10-spr1 (2015-02-04)


#### Bug Fixes

* **app:**
  * Status request needs to occur later. ([b6c538b6](https://github.com/NCI-GDC/portal-ui/commit/b6c538b679357c5ee995171e6592b14148ddfa83))
  * Fix model loading spinner. ([5dea5e4c](https://github.com/NCI-GDC/portal-ui/commit/5dea5e4cb0e8577200b81e36ad9e54e82138dd95))
* **cart:**
  * add all to cart uses my projects filter ([c720a8bf](https://github.com/NCI-GDC/portal-ui/commit/c720a8bfb8aaee8fc88a2fda8117c1967f030a37), closes [OICR-236](https://jira.opensciencedatacloud.org/browse/OICR-236))
  * ensure cart cols filled ([a54e3a2c](https://github.com/NCI-GDC/portal-ui/commit/a54e3a2cafccf24f2cd52470e837c28b1d2499a2), closes [OICR-245](https://jira.opensciencedatacloud.org/browse/OICR-245))
* **pagination:** Fixes pagination total pages. ([308e921d](https://github.com/NCI-GDC/portal-ui/commit/308e921d0b353ad31451e73f811cbc586222c839), closes [OICR-238](https://jira.opensciencedatacloud.org/browse/OICR-238))
* **search:** don't add removed facets on tabswitch ([f5ce5781](https://github.com/NCI-GDC/portal-ui/commit/f5ce57819ce7a43003d88d6779a7204b30f72210))
* **table:** prevent no data flash ([758afd15](https://github.com/NCI-GDC/portal-ui/commit/758afd159e3d92f25fbd7fe58822174fc859c641))


#### Features

* **app:**
  * use export-table with gdc-table ([8097c365](https://github.com/NCI-GDC/portal-ui/commit/8097c36522cc0dc26adb0facec41d770bcce4783))
  * show api ver in ui ([1bf7f5f6](https://github.com/NCI-GDC/portal-ui/commit/1bf7f5f68ebc23ac8278737467dba79a7d8ce15e), closes [OICR-249](https://jira.opensciencedatacloud.org/browse/OICR-249))
* **cart:** increase limit to 10,000 ([e173d2af](https://github.com/NCI-GDC/portal-ui/commit/e173d2af157830605f946b42ad6b8c1a6acf39b2))
* **facets:**
  * Updates for multiple terms. ([6d2adf59](https://github.com/NCI-GDC/portal-ui/commit/6d2adf59a1f972552385cd02f5e2032d3a4e9ae8), closes [OICR-250](https://jira.opensciencedatacloud.org/browse/OICR-250))
  * Keyboard support for autocomplete. ([afd34269](https://github.com/NCI-GDC/portal-ui/commit/afd342695e808c391473bde2a58332ed0e68076c), closes [OICR-221](https://jira.opensciencedatacloud.org/browse/OICR-221))
* **search:** export tbl to file ([5d034272](https://github.com/NCI-GDC/portal-ui/commit/5d034272c83631b3b3694585a8f3f355603fd216))
* **table:**
  * sort, visibility reorder ([ce1965ab](https://github.com/NCI-GDC/portal-ui/commit/ce1965aba3c6eb2f54891ec36fbc7fd48df0b7b5), closes [OICR-247](https://jira.opensciencedatacloud.org/browse/OICR-247))
  * add reset button to table ([47e42caf](https://github.com/NCI-GDC/portal-ui/commit/47e42cafe26caae726299581e8386c7d730eb684), closes [OICR-261](https://jira.opensciencedatacloud.org/browse/OICR-261))
  * nested fields ([490b62dc](https://github.com/NCI-GDC/portal-ui/commit/490b62dc4927c5b974d7e29bbf50f5a3db5915ed))
  * fix bug ([0ae9e336](https://github.com/NCI-GDC/portal-ui/commit/0ae9e3364e3483f9d8e82eff1d3ada71b90dd1ed))
  * add compile ([d567af1b](https://github.com/NCI-GDC/portal-ui/commit/d567af1b1c4d01390b1db8c4cee7ed437e314722), closes [OICR-232](https://jira.opensciencedatacloud.org/browse/OICR-232))
  * sref in trycatch ([e1e8fda4](https://github.com/NCI-GDC/portal-ui/commit/e1e8fda4af0f83f293323eae48d7276596d750ae))
  * fix bug ([8dead21d](https://github.com/NCI-GDC/portal-ui/commit/8dead21d37bfaaa80e895bd8e97cc09acd146cc9))
  * add directive to search page ([239ea774](https://github.com/NCI-GDC/portal-ui/commit/239ea77490f9fc555f77dbe38fca25bf0dff5cef))
* **tableicious:**
  * search filter to dropdown ([d527ff02](https://github.com/NCI-GDC/portal-ui/commit/d527ff02792bba5bae95380af50219e28cbd2a54), closes [OICR-243](https://jira.opensciencedatacloud.org/browse/OICR-243))
  * Control table loading spinner. ([1a68e1cd](https://github.com/NCI-GDC/portal-ui/commit/1a68e1cdf601328edb86e7803602c3ec8b6690ca), closes [OICR-219](https://jira.opensciencedatacloud.org/browse/OICR-219))
* **tables:** Create GDC wrappeer table directive. ([2890b07d](https://github.com/NCI-GDC/portal-ui/commit/2890b07d5043c2d8e8cee2158c5e601b9872796f), closes [OICR-220](https://jira.opensciencedatacloud.org/browse/OICR-220))


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


