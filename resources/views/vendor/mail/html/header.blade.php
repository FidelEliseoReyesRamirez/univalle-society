@props(['url'])
<tr>
    <td class="header">
        <a href="{{ $url }}" style="display: inline-block;">
            {{-- asset() genera automáticamente la URL completa de tu localhost --}}
            <img src="{{ asset('images/logo.png') }}" class="logo" alt="SICI - ISI Univalle" style="height: 80px; width: auto;">
        </a>
    </td>
</tr>