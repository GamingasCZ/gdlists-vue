import ReviewImage from "./ReviewImage.vue"
import ReviewLevel from "./ReviewLevel.vue"
import ReviewVideo from "./ReviewVideo.vue"
import ReviewList from "./ReviewList.vue"
import ReviewDivisor from "./ReviewDivisor.vue"
import NestContainer from "./NestContainer.vue"
import ReviewRatings from "./ReviewRatings.vue"
import ReviewUsers from "./ReviewUsers.vue"
import { i18n } from "@/locales"
import ReviewCarousel from "./ReviewCarousel.vue"

const success = {success: true}

const error = (ind: number, msg = 0) => {
    const message = [i18n.global.t('reviews.isMissing'), i18n.global.t('reviews.notSelected'), i18n.global.t('reviews.areEmpty'), i18n.global.t('reviews.isEmpty')]
    return {success: false, error: message[msg], index: ind}
}

const containers: Containers = {
    default: {
        placeholder: i18n.global.t('reviews.paragraph'),
        styling: "min-h-12 my-1",
        nestable: true,
        canEditText: true,
        settings: [{
            key: "noMD",
            title: i18n.global.t('reviews.disMD'),
            type: [2],
            default: false,
        },
        {
            key: "size",
            title: i18n.global.t('reviews.fontSize'),
            type: [6, i18n.global.t('settingsMenu.qMed'), 8, 12, 14, 16, 20, 24, 32, 36, 48, 64],
            default: 0,
        },
        {
            key: "indent",
            title: i18n.global.t('reviews.indent'),
            type: [2],
            default: false,
        },
    ]
    },
    heading1: {
        placeholder: i18n.global.t('reviews.title', [1]),
        styling: "text-3xl leading-10 my-4",
        nestable: true,
        canEditText: true,
        settings: []
    },
    heading2: {
        placeholder: i18n.global.t('reviews.title', [2]),
        styling: "text-2xl leading-8 my-3",
        nestable: true,
        canEditText: true,
        settings: []
    },
    heading3: {
        placeholder: i18n.global.t('reviews.title', [3]),
        styling: "text-xl leading-6 my-2",
        nestable: true,
        canEditText: true,
        settings: []
    },
    divisor: {
        placeholder: "",
        childStyling: "",
        nestable: true,
        canEditText: false,
        additionalComponents: [ReviewDivisor],
        settings: [
            {
                key: "sizeY",
                title: "",
                type: [-1],
                default: 32,
            },
            {
                key: "visible",
                title: i18n.global.t('other.visible'),
                type: [2],
                default: true,
            }
        ]
    },
    showImage: {
        nestable: true,
        canEditText: false,
        additionalComponents: [ReviewImage],
        settings: [
            {
                key: "url",
                title: i18n.global.t('reviews.imgUrl'),
                type: [-1],
                default: "",
            },
            {
                key: "width",
                title: "",
                type: [-1],
                default: 0
            },
            {
                key: "pick",
                title: i18n.global.t('reviews.pick'),
                type: [1],
                default: 0
            },
            {
                key: "alt",
                title: i18n.global.t('reviews.alttext'),
                type: [0],
                default: ""
            },
            {
                key: "description",
                title: i18n.global.t('reviews.imageDesc'),
                type: [0],
                default: ""
            },
            {
                key: "link",
                title: i18n.global.t('other.link'),
                type: [0],
                default: ""
            },
            {
                key: "onlyDeco",
                title: i18n.global.t('reviews.decoOnly'),
                type: [2],
                default: false
            },
        ],
        errorCheck: (settings: object) => settings.url.length ? success : error(0)
    },
    addVideo: {
        nestable: true,
        canEditText: false,
        additionalComponents: [ReviewVideo],
        settings: [
            {
                key: "width",
                title: "",
                type: [-1],
                default: 320
            },
            {
                key: "url",
                title: i18n.global.t('reviews.ytLink'),
                type: [0],
                required: true,
                default: ""
            },
            {
                key: "description",
                title: i18n.global.t('reviews.videoDesc'),
                type: [0],
                default: ""
            }
        ],
        errorCheck: (settings: object) => settings.url.length ? success : error(1)
    },
    showRating: {
        nestable: true,
        canEditText: false,
        additionalComponents: [ReviewRatings],
        settings: [
            {
                key: "level",
                title: i18n.global.t('other.level'),
                type: [4],
                default: 0
            },
            {
                key: "show",
                title: i18n.global.t('reviews.rating'),
                type: [5],
                default: -1
            }
        ]

    },
    showLevel: {
        nestable: false,
        canEditText: false,
        additionalComponents: [ReviewLevel],
        settings: [
            {
                key: "pickedIndex",
                title: i18n.global.t('other.level'),
                type: [-1],
                required: true,
                default: -1
            },
            {
                key: "pickLevel",
                title: i18n.global.t('reviews.pickLevel'),
                type: [1],
                default: 0
            },
            {
                key: "showCollab",
                title: i18n.global.t('reviews.dispCollab'),
                type: [2],
                default: true
            },
            {
                key: "description",
                title: i18n.global.t('reviews.levelDesc'),
                type: [0],
                default: ""
            }
        ],
        errorCheck: (settings: object) => settings.pickedIndex != -1 ? success : error(0, 1)
    },
    showList: {
        nestable: true,
        canEditText: false,
        additionalComponents: [ReviewList],
        limit: 20,
        settings: [
            {
                key: "post",
                title: i18n.global.t('other.post'),
                type: [-1],
                required: true,
                default: false
            },
            {
                key: "postType",
                title: i18n.global.t('other.post'),
                type: [-1],
                default: 0
            },
            {
                key: "pick",
                title: i18n.global.t('reviews.pickList'),
                type: [1],
                default: 0
            }
        ],
        errorCheck: (settings: object) => settings.post ? success : error(0, 1)
    },
    twoColumns: {
        nestable: true,
        canEditText: false,
        dependentOnChildren: true,
        additionalComponents: [NestContainer, NestContainer],
        settings: [{
            key: "components",
            title: i18n.global.t('reviews.columns'),
            type: [-1],
            default: [[], []]
        }],
        errorCheck: (settings: object) => {
            let len = 0
            settings.components.forEach(e => len += e.length)
            return len ? success : error(0, 2)
        }
    },
    addCarousel: {
        nestable: false,
        canEditText: false,
        dependentOnChildren: false,
        additionalComponents: [ReviewCarousel],
        settings: [
            {
                key: "components",
                title: i18n.global.t('reviews.carousel'),
                type: [-1],
                required: true,
                default: []
            },
            {
                key: "height",
                title: '',
                type: [-1],
                required: true,
                default: 192
            },
            {
                key: "pick",
                title: i18n.global.t('reviews.pickMedia'),
                type: [1],
                default: 0
            },
            {
                key: "overflow",
                title: i18n.global.t('reviews.overflow'),
                type: [2],
                default: false
            },
            {
                key: "crop",
                title: i18n.global.t('reviews.cropWidth'),
                type: [2],
                default: false
            },
        ],
        errorCheck: (settings: object) => settings.components.length ? success : error(0, 3)
    }
}

/*
    showCollab: {
        nestable: true,
        canEditText: false,
        additionalComponents: [ReviewUsers],
        settings: [
        {
            key: "users",
            title: i18n.global.t('other.users'),
            type: [-1],
            required: true,
            default: []
        },
        {
            key: "pick",
            title: i18n.global.t('reviews.editMembers'),
            type: [1],
            default: 0
        },
        {
            key: "colums",
            title: i18n.global.t('reviews.displayColumns'),
            type: [2],
            default: false
        }]
    }
        */

export default containers

export type Containers = {
    default: Container
    heading1: Container
    heading2: Container
    heading3: Container
    divisor: Container
    list: Container
    showImage: Container
    showLevel: Container
    showList: Container
    addVideo: Container
    showRating: Container
    twoColumns: Container
    showCollab: Container
    addCarousel: Container
}

export type Container = {
    placeholder?: string,
    styling?: string,
    childStyling?: string,
    dependentOnChildren?: boolean
    additionalComponents?: any[],
    componentProps?: Container,
    limit?: number,
    nestable: boolean,
    canEditText: boolean,
    settings: ContainerSettings[],
    errorCheck?: (x: object) => {success: boolean, mess?: string}
}

export type ContainerSettings = {
    key: string
    title: string
    type: number[]
    default: any
    required?: boolean
}