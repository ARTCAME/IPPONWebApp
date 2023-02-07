<template>
    <div
        class="documentation-launcher"
        title="Documentación"
        v-b-tooltip.hover.right.noninteractive
        v-b-modal.user-doc>
        <router-link target="_blank" to="/wiki">
            <fa-icon id="lancher-icon" icon="book-open"></fa-icon>
        </router-link>
    </div>
</template>
<style scoped>
    .documentation-launcher {
        background: rgba(0, 50, 131, .95);
        border-radius: 50%;
        bottom: 14px;
        box-shadow: 0 0 3px rgba(0,0,0,.5);
        font-size: 17px;
        height: 30px;
        left: .5rem /* calc(1.7% - 4px) */;
        line-height: 30px;
        opacity: .8;
        overflow: hidden;
        position: fixed;
        text-align: center;
        transform: scale(0.98);
        transition: all .3s;
        width: 30px;
        z-index: 1100;
    }
    .documentation-launcher:hover {
        opacity: 1;
        transform: scale(1);
    }
    #lancher-icon {
        color: rgba(250, 250, 250, 1);
    }
</style>
