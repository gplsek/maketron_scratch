$j = jQuery.noConflict();
function sw_ajax_win_request(nid) {
$j('#block-scratchandwin-scratch-block').load("/check-winner/"+nid);
}

